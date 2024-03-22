import User from "../models/userModel.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import NodeCache from "node-cache";
const otpCache = new NodeCache();
// initialize nodemailer
const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sravs.vadlamanu@gmail.com', // Replace with your email address
        pass: 'jkvb thrg buul chho', // Replace with your Gmail app password if two step verification is ON generate the app password and replace it
    },
    tls: {
        rejectUnauthorized: true,
    },
});

// generate otp
const generateOTP = (length) => {
    const digits = "0123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)];
    }

    return OTP;
}

// to create user
const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // User already exists
            return res.status(409).send({ message: "User already exists" });
        }
        let hashedPassword = bcrypt.hashSync(password, 10);
        // Create new user
        const newUserData = {
            email,
            password: hashedPassword,
        };
        // create and save new user in db
        const newUser = new User(newUserData);
        const newUserCreated = await newUser.save();
        if (newUserCreated) {
            return res.status(201).send({ response: newUserCreated });
        } else {
            return res.status(500).send({ message: "User not created" });
        }
    } catch (error) {
        return res.status(500).send({ message: `Internal Server Error : ${error}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isCorrectPassword = await bcrypt.compareSync(password, user.password)
        if (isCorrectPassword) {
            const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1w' })
            return res.status(200).json({ token, message: "Login successful" })
        } else {
            return res.status(200).json({ message: "Wrong password" })
        }

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error:" + err })
    }
}

// get all users 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length) {
            //on successful data fetch
            res.status(200).send({ users });
        } else {
            res.status(200).send({ users: null });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Internal Server Error: ${err}` })
    }
}

// send otp to mail
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "user not found" })
        }
        const otp = generateOTP(5);

        const mailOptions = {
            to: req.body.email,
            subject: 'Secrete Scribbles Login OTP',
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secrete Scribbles: OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #232b35;
      line-height: 1.5;
    }
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      text-align: center;
    }
    .logo {
      height: 50px;
      width: auto;
      display: block;
      margin: 0 auto 10px;
    }
    .content {
      margin-bottom: 20px;
    }
    .otp-code {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #aaa;
      margin-top: 20px;
    }
    a {
      color: #333;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Secrete Scribbles</h1>
    </div>
    <div class="content">
      <p>Hi there, </p>
      <p>We've received a request to reset your password for your Secrete Scribbles account associated with this email address.</p>
      <p>Here's your One-Time Password (OTP) to verify your identity:</p>
      <h2 class="otp-code">${otp}</h2>
      <p>Please enter this code on the password reset page to proceed.</p>
      <p>This OTP is valid for 10 minutes. If you don't initiate the password reset within this time, you'll need to request a new one.</p>
      <p><b>Important:</b> Please do not share this OTP with anyone. We will never ask you for your OTP via email or any other communication channel.</p>
    </div>
    <div class="footer">
      <p>Having trouble? Contact us at <a href="mailto:support@secretescribbles.com">support@secretescribbles.com</a>.</p>
    </div>
  </div>
</body>
</html>`
        }

        smtpTransport.sendMail(mailOptions, async (err) => {
            if (err) {
                return res.status(500).json({ error: err })
            } else {
                const cacheKey = `${email}_otp`;
                otpCache.set(cacheKey, otp, 60);
                const cachedOtp = otpCache.get(cacheKey);
                console.log("cashed otp", cachedOtp);
                return res.status(200).json({ success: true, message: "Email sent successfully" })
            }
        })
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error:" + err })
    }
}

// validate otp to save password
const validateAndSavePassword = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "user not found" })
        }
        // get otp from node cache
        const cacheKey = `${email}_otp`;
        console.log('cache', cacheKey);
        const cachedOtp = otpCache.get(cacheKey);
        console.log('cached otp , otp', cachedOtp, otp);
        
        if (cachedOtp === undefined) {
            return res.status(200).json({ isSuccess: false, message: "otp time out please request for another otp" })
        }
        if (otp === cachedOtp) {
            return res.status(200).json({ isSuccess: true, message: "Otp validated" })
        } else {
            return res.status(200).json({ isSuccess: false, message: "Invalid OTP" })
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error: " + err })
    }

}

export default { signUp, getAllUsers, login, forgotPassword, validateAndSavePassword };

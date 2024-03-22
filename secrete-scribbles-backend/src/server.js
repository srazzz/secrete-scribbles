import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
//initializations
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

import authRoute from './routes/authRoutes.js'
import threadRoute from './routes/threadsRoutes.js'


const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("🚀 Connected to Database Successfully 🚀");
            app.use('/auth', authRoute)
            app.use('/post', threadRoute)
        })
        .catch(error => {
            console.error("Error connecting to database:", error);
        });
}
// Connect to MongoDB
connectDatabase();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running 🚀 Listening on port ${PORT}`);
});

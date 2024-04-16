import jwt from 'jsonwebtoken'
//JWT verification middleware function
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.'+err });
        }
        req.body.userId = decoded.user.uuid;
        next();
    });
};

export default verifyToken
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "Invalid token or user not found." });
        }
        
        req.user = user;
        // In the original app, req.session.schoolId was used heavily. 
        // We will mock this behaviour using req.user properties or set a new req.schoolId
        req.schoolId = user._id; // Use this across controllers instead of req.session.schoolId
        
        next();
    } catch (e) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

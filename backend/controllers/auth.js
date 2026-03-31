const User = require("../models/user");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        
        const token = jwt.sign({ id: registeredUser._id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ 
            message: "User registered successfully", 
            user: registeredUser, 
            token 
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};


module.exports.login = (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ 
        message: "Login successful", 
        user: req.user, 
        token 
    });
};

module.exports.logout = (req, res, next) => {
    // For JWT, logout is usually handled client-side by deleting the token.
    res.status(200).json({ message: "Logout successful" });
};

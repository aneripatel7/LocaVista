const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");

// Authenticate any user (admin, organizer, or attendee)
const authenticateUser = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded); // Debugging

        const user = await User.findById(decoded.id);
        if (user) {
            req.user = user;
            // console.log("Authenticated User:", req.user);
            return next();
        }

        const attendee = await Attendee.findById(decoded.id);
        if (attendee) {
            req.user = attendee;
            // console.log("Authenticated Attendee:", req.user);
            return next();
        }

        return res.status(401).json({ message: "Unauthorized: User not found" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};


// Check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ message: "Forbidden: Admins only!" });
};

// Check if user is an organizer
const isOrganizer = (req, res, next) => {
    if (req.user?.role === "organizer") return next();
    return res.status(403).json({ message: "Forbidden: Organizers only!" });
};

// Check if user is an attendee
const isAttendee = (req, res, next) => {
    if (req.user && req.user._id) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Attendees only!" });
};


// Verify JWT token without user role checks
const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token", error: err.message });
    }
};

module.exports = { authenticateUser, isAdmin, isOrganizer, isAttendee, verifyToken };

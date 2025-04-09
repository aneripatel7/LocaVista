const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");

// Helper to extract token from Authorization header
const extractToken = (req) => {
    const header = req.header("Authorization");
    if (header && header.startsWith("Bearer ")) {
        return header.split(" ")[1];
    }
    return null;
};

// Authenticate any user (admin, organizer, or attendee)
const authenticateUser = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the user exists in the User model (admin/organizer)
        const user = await User.findById(decoded.id);
        
        if (user) {
            req.user = user;
            return next();
        }

        // If user is not found in the User model, check the Attendee model
        const attendee = await Attendee.findById(decoded.id);
        if (attendee) {
            req.user = attendee;
            return next();
        }

        return res.status(401).json({ message: "Unauthorized: User not found" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

// Role-based Middleware

const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ message: "Forbidden: Admins only!" });
};

const isOrganizer = (req, res, next) => {
    if (req.user?.role === "organizer") return next();
    return res.status(403).json({ message: "Forbidden: Organizers only!" });
};

const isAttendee = (req, res, next) => {
    // Attendees don't have a 'role' field but exist in the Attendee model
    if (req.user && !req.user.role && req.user._id) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Attendees only!" });
};

// Just verifies token, doesn't attach full user info
const verifyToken = (req, res, next) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

    try {
        // Verify token and decode it
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token", error: err.message });
    }
};

module.exports = {
    authenticateUser,
    isAdmin,
    isOrganizer,
    isAttendee,
    verifyToken,
};

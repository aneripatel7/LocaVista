const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");

// Authenticate any user (admin, organizer, or attendee)
const authenticateUser = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // Check if user is an admin or organizer
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
            req.user = user;
            return next();
        }

        // Check if user is an attendee
        const attendee = await Attendee.findById(decoded.id).select("-password");
        if (attendee) {
            req.user = attendee;
            return next();
        }

        return res.status(401).json({ message: "Unauthorized: User not found" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// checking if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Insufficient Permissions!" });
};

// checking if the user is an organizer
const isOrganizer = (req, res, next) => {
    if (req.user && req.user.role === "organizer") {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Only organizers can perform this action!" });
};

// checking if the user is an attendee
const isAttendee = (req, res, next) => {
    if (req.user && req.user._id) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Only attendees can book events!" });
};


const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};
module.exports = { authenticateUser, isAdmin, isOrganizer, isAttendee, verifyToken };

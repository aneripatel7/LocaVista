const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");
require("dotenv").config();

// Register Admin/Organizer
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.json({ message: "registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Register Attendee
exports.registerAttendee = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let attendee = await Attendee.findOne({ email });
        if (attendee) return res.status(400).json({ message: "Attendee already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        attendee = new Attendee({ name, email, password: hashedPassword });
        await attendee.save();

        res.json({ message: "Attendee registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Register Attendee
exports.loginAttendee = async (req, res) => {
    const { email, password } = req.body;
    try {
        const attendee = await Attendee.findOne({ email });
        if (!attendee) return res.status(400).json({ message: "Attendee not found" });

        const isMatch = await bcrypt.compare(password, attendee.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: attendee._id, role: "attendee" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

//logged out 
exports.logoutUser = (req, res) => {
    try {
        res.clearCookie("token"); 
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error });
    }
};



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");
require("dotenv").config();
const validator = require("validator");

// ✅ Function to Validate Email with Messages
const validateEmail = (email) => {
    const validDomains = ["com", "net", "org", "edu", "gov", "in"];
    const roleBasedEmails = ["admin", "support", "info", "noreply", "contact", "help", "sales"];
    const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "dispostable.com"];
    const testDomains = ["example.com", "test.com", "demo.com", "fakeemail.com"];

    if (!validator.isEmail(email)) {
        return { valid: false, message: "Invalid email format." };
    }

    const emailParts = email.split("@");
    if (emailParts.length !== 2) return { valid: false, message: "Invalid email structure." };

    const [localPart, domain] = emailParts;
    const domainParts = domain.split(".");

    if (domainParts.length < 2) return { valid: false, message: "Email domain is not valid." };

    const topLevelDomain = domainParts.pop();
    const baseDomain = domainParts.join(".");

    if (!validDomains.includes(topLevelDomain)) {
        return { valid: false, message: "Only real business, education, and organization emails are allowed." };
    }

    if (disposableDomains.includes(domain)) {
        return { valid: false, message: "Disposable emails are not allowed." };
    }

    if (roleBasedEmails.includes(localPart)) {
        return { valid: false, message: "Role-based emails (admin, support, etc.) should not be used for personal accounts." };
    }

    if (testDomains.includes(domain)) {
        return { valid: false, message: "Test or example emails are not allowed for registration." };
    }

    return { valid: true, message: "Valid email." };
};

// ✅ Function to Validate Password
const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must include at least one uppercase letter." };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must include at least one lowercase letter." };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must include at least one number." };
    }
    if (!/[@$!%*?&]/.test(password)) {
        return { valid: false, message: "Password must include at least one special character (@$!%*?&)." };
    }
    return { valid: true, message: "Valid password." };
};

// ✅ Register Admin/Organizer
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            return res.status(400).json({ message: emailCheck.message });
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return res.status(400).json({ message: passwordCheck.message });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.json({ message: "Registered successfully!" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Register Attendee
exports.registerAttendee = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const emailCheck = validateEmail(email);
        if (!emailCheck.valid) {
            return res.status(400).json({ message: emailCheck.message });
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return res.status(400).json({ message: passwordCheck.message });
        }

        let attendee = await Attendee.findOne({ email });
        if (attendee) return res.status(400).json({ message: "Attendee already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        attendee = new Attendee({ name, email, password: hashedPassword });
        await attendee.save();

        res.json({ message: "Attendee registered successfully!" });
    } catch (err) {
        console.error("Register Attendee Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Login Admin/Organizer
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
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Login Attendee
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
        console.error("Login Attendee Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Logout User
exports.logoutUser = (req, res) => {
    try {
        res.clearCookie("token"); 
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error });
    }
};

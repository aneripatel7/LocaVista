const Attendee = require("../models/Attendee");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Function to validate allowed email types
const isValidEmail = (email) => {
    const validDomains = ["com", "net", "org", "edu", "gov", "in"];
    const roleBasedEmails = ["admin", "support", "info", "noreply", "contact", "help", "sales"];
    const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "dispostable.com"];

    const emailParts = email.split("@");
    if (emailParts.length !== 2) return false;

    const [localPart, domain] = emailParts;
    const domainParts = domain.split(".");

    if (domainParts.length < 2) return false;

    const topLevelDomain = domainParts.pop();
    const baseDomain = domainParts.join(".");

    if (!validDomains.includes(topLevelDomain)) return false;
    if (disposableDomains.includes(domain)) return false;
    if (roleBasedEmails.includes(localPart)) return false;

    return validator.isEmail(email);
};

// ✅ Update Attendee Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        let { name, email, interests } = req.body;
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

        // Validate email if it's being updated
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format or domain" });
        }

        // Ensure email is not already in use by another attendee
        if (email) {
            const existingUser = await Attendee.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use by another attendee" });
            }
        }

        // Build update object dynamically
        const updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (interests) updatedData.interests = interests;
        if (profilePicture) updatedData.profilePicture = profilePicture;

        const attendee = await Attendee.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        if (!attendee) return res.status(404).json({ message: "Attendee not found" });

        res.status(200).json({ message: "Profile updated successfully", attendee });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Change Password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await Attendee.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        // Ensure the new password is not the same as the old password
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: "New password must be different from the old password" });
        }

        // Enforce password length (minimum 6 characters)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Hash new password and update user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { updateProfile, changePassword };

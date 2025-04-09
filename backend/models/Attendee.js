const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true }, // Google Login Support
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Make password optional for Google users
    profilePicture: { type: String, default:"default-avatar.png" }, // Store Google profile picture
    interests: [{ type: String }] // Array of interests
}, { timestamps: true });

module.exports = mongoose.model("Attendee", attendeeSchema);

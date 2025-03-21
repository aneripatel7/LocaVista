const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }, // Store profile picture URL
    interests: [{ type: String }], // Array of interests
}, { timestamps: true });

module.exports = mongoose.model("Attendee", attendeeSchema);

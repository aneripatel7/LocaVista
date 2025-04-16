const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: [{ type: String }], // Array of interests
}, { timestamps: true });

module.exports = mongoose.model("Attendee", attendeeSchema);

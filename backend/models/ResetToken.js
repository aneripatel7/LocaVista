const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee", required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("ResetToken", ResetTokenSchema);

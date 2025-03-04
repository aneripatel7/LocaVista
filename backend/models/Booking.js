const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticketId: { type: String, unique: true, default: uuidv4 },
    qrCodeUrl: { type: String },  // Store QR code URL
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);

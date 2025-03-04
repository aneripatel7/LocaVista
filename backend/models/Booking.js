const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);

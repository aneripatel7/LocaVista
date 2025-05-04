const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['success', 'failed'], default: 'success' },
    paymentId: { type: String },
    orderId: { type: String },
    bookedAt: { type: Date, default: Date.now },
    qrCodeUrl: { type: String },  
  });

module.exports = mongoose.model("Booking", BookingSchema);

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false },
    ticketPrice: { type: Number, required: true } 
});

module.exports = mongoose.model("Event", EventSchema);

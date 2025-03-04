const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Organizer ID
});

module.exports = mongoose.model("Event", EventSchema);

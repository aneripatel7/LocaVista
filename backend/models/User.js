const mongoose = require("mongoose");

const AdminOrganizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "organizer"], required: true },
});

module.exports = mongoose.model("AdminOrganizer", AdminOrganizerSchema);

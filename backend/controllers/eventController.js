const Event = require("../models/Event");

const createEvent = async (req, res) => {
    try {
        const { title, date, location, description, price } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "Organizer ID is missing. Please authenticate." });
        }

        if (price === undefined || price < 0) {
            return res.status(400).json({ message: "Ticket price must be a positive number." });
        }

        const organizerId = req.user._id;

        const event = new Event({ title, date, location, description, price, organizer: organizerId });
        await event.save();

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admins can view all events" });
        }

        const events = await Event.find().select("title date location description price approved");
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).select("title date location description price approved");
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Approve an event (Admin Only)
const approveEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.approved = true;
        await event.save();

        res.status(200).json({ message: "Event approved successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Reject an event
const rejectEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Event.findByIdAndDelete(eventId); // Remove the event from DB

        res.status(200).json({ message: "Event rejected and deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Fetch only approved events
const getApprovedEvents = async (req, res) => {
    try {
        const events = await Event.find({ approved: true }).select("title date location description price");
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { createEvent, getAllEvents, getEventById, approveEvent, rejectEvent, getApprovedEvents }; 
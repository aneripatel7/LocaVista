const Event = require("../models/Event");

// Create an event
const createEvent = async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        const organizerId = req.user._id;

        const event = new Event({ title, date, location, description, organizer: organizerId });
        await event.save();

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createEvent, getAllEvents, getEventById }; 
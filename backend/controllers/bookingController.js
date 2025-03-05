const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Book an event
const bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // ✅ Prevent booking if event is not approved
        if (!event.approved) {
            return res.status(400).json({ message: "Booking not allowed. Event is pending approval." });
        }

        // Create a new booking
        const booking = new Booking({ userId, eventId });
        await booking.save();

        res.status(201).json({ message: "Event booked successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user bookings
const getBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ userId }).populate("eventId");

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check-in API for event organizers
const checkInUser = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const booking = await Booking.findOne({ ticketId }).populate("eventId");

        if (!booking) return res.status(404).json({ message: "Invalid Ticket!" });

        return res.status(200).json({ message: "Check-in successful!", event: booking.eventId });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { bookEvent, getBookings, checkInUser};

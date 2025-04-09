const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Book an event
const bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Ensure the event is approved before booking
        if (!event.approved) {
            return res.status(400).json({ message: "Booking not allowed. Event is pending approval." });
        }

        // Check if the user has already booked this event
        const existingBooking = await Booking.findOne({ userId, eventId });
        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this event." });
        }

        // Create a new booking
        const booking = new Booking({ userId, eventId, status: "confirmed" }); // Adding status for future tracking
        await booking.save();

        res.status(201).json({ message: "Event booked successfully!", booking });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all bookings for a user
const getBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ userId })
            .populate({
                path: "eventId",
                select: "title date location eventImage category",
            });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found." });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Check-in API for event organizers
const checkInUser = async (req, res) => {
    try {
        const { ticketId } = req.body;

        // Find the booking based on the ticket ID
        const booking = await Booking.findOne({ ticketId }).populate({
            path: "eventId",
            select: "title location date",
        });

        if (!booking) {
            return res.status(404).json({ message: "Invalid Ticket!" });
        }

        if (booking.status === "checked-in") {
            return res.status(400).json({ message: "User has already checked in." });
        }

        // Mark the booking as checked-in
        booking.status = "checked-in";
        await booking.save();

        return res.status(200).json({ message: "Check-in successful!", event: booking.eventId });
    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { bookEvent, getBookings, checkInUser };

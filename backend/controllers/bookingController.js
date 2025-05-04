
const Booking = require("../models/Booking");
const User = require("../models/User");
const Event = require("../models/Event");
const { sendPaymentConfirmationEmail } = require("../utils/sendEmail"); // Import the email functions

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

        // Send a booking confirmation email
        const user = await User.findById(userId); // Fetch the user details
        await sendPaymentConfirmationEmail(user.email, user.name, event.title, booking.ticketId, event.ticketPrice, event.date);

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

        // Find bookings for the logged-in user and populate event details
        const bookings = await Booking.find({ userId })
            .populate({
                path: "eventId",
                select: "title date location eventImage category", // Select specific fields
            });

        // Respond with 200 even if no bookings (let frontend handle empty state)
        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
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

const getBookingsForOrganizer = async (req, res) => {
    try {
        const organizerId = req.user._id;

        // Get all events created by this organizer
        const events = await Event.find({ organizer: organizerId });

        if (!events.length) {
            return res.status(404).json({ success: false, message: "No events found for this organizer." });
        }

        const eventIds = events.map(event => event._id);

        // Aggregate bookings for these events and count them
        const bookings = await Booking.aggregate([
            { $match: { eventId: { $in: eventIds } } }, // Match bookings for these events
            { $group: { 
                _id: "$eventId",  // Group by event ID
                bookingsCount: { $sum: 1 }  // Count the number of bookings for each event
            }}
        ]);

        // Map events to include booking count
        const eventsWithBookings = events.map(event => {
            const booking = bookings.find(b => b._id.toString() === event._id.toString());
            return {
                eventId: event._id,
                title: event.title,
                date: event.date,
                location: event.location,
                bookings: booking ? booking.bookingsCount : 0 // Default to 0 if no bookings found
            };
        });

        res.status(200).json({ success: true, events: eventsWithBookings });
    } catch (error) {
        console.error("Error fetching organizer bookings:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



module.exports = { bookEvent, getBookings, checkInUser ,getBookingsForOrganizer};

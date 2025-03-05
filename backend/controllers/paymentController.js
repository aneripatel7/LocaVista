const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Get event revenue details (Only Admin & Organizer can access)
const getEventRevenue = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role; // Fetch user role from the request

        // Fetch the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Ensure the event has a ticket price
        if (!event.ticketPrice || event.ticketPrice <= 0) {
            return res.status(400).json({ message: "Ticket price is not set for this event." });
        }

        // Only the event organizer or an admin can view revenue
        if (event.organizer.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "Access denied. Only organizers and admins can view revenue." });
        }

        // Count number of bookings for this event
        const bookingCount = await Booking.countDocuments({ eventId });

        // Calculate total revenue
        const totalRevenue = bookingCount * event.ticketPrice;

        // Define revenue split (80% Organizer, 20% Admin)
        const organizerShare = totalRevenue * 0.8;
        const adminShare = totalRevenue * 0.2;

        res.status(200).json({
            eventId,
            eventTitle: event.title,
            bookingCount,
            ticketPrice: event.ticketPrice,
            totalRevenue,
            organizerShare,
            adminShare
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getEventRevenue };

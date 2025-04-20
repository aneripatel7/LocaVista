const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Add missing crypto module
require("dotenv").config();

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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/payment/initiate
const initiatePayment = async (req, res) => {
  try {
    const { eventId, amount } = req.body;
    
    const options = {
      amount: amount * 100,  // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        eventId,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error("Error initiating payment:", err);
    res.status(500).json({ message: "Payment initiation failed", error: err.message });
  }
};

// @route POST /api/payment/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment is successful, now save booking and handle success
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

      const booking = new Booking({
        userId: req.user._id,
        eventId,
        ticketId: `ticket_${Date.now()}`, // Generate a unique ticket ID
        amount: event.ticketPrice,
        paymentStatus: "success",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      await booking.save(); // Save the booking to the database

      // Send response with booking info
      res.json({
        success: true,
        message: "Payment verified successfully",
        booking: {
          ticketId: booking.ticketId,
          eventId: event._id,
          eventTitle: event.title,
          amount: event.ticketPrice,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
};

module.exports = { getEventRevenue, initiatePayment, verifyPayment };

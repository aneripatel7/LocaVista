const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { sendPaymentConfirmationEmail } = require("../utils/sendEmail");

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get event revenue details (Only Admin & Organizer can access)
const getEventRevenue = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.ticketPrice || event.ticketPrice <= 0) {
      return res.status(400).json({ message: "Ticket price is not set for this event." });
    }

    if (event.organizer.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Only organizers and admins can view revenue." });
    }

    const bookingCount = await Booking.countDocuments({ eventId });
    const totalRevenue = bookingCount * event.ticketPrice;
    const organizerShare = totalRevenue * 0.8;
    const adminShare = totalRevenue * 0.2;

    res.status(200).json({
      eventId,
      eventTitle: event.title,
      bookingCount,
      ticketPrice: event.ticketPrice,
      totalRevenue,
      organizerShare,
      adminShare,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Initiate payment for booking
const initiatePayment = async (req, res) => {
  try {
    const { eventId, amount } = req.body;
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { eventId },
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Payment initiation failed", error: err.message });
  }
};

// Verify payment and confirm booking
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

      const booking = new Booking({
        userId: req.user._id,
        eventId,
        ticketId: `ticket_${Date.now()}`,
        amount: event.ticketPrice,
        paymentStatus: "success",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      await booking.save();

      // Send payment confirmation email
      const user = req.user; // Assuming user details are stored in the request
      await sendPaymentConfirmationEmail(user.email, user.name, event.title, booking.ticketId, event.ticketPrice, event.date);

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
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
};

module.exports = { getEventRevenue, initiatePayment, verifyPayment };

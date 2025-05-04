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
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only organizers can see their own events
    if (userRole === "organizer") {
      if (event.organizer.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to view this event's revenue." });
      }
    }

    // Admins can view any event
    if (userRole !== "organizer" && userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Only organizers and admins can view revenue." });
    }

    if (!event.ticketPrice || event.ticketPrice <= 0) {
      return res.status(400).json({ message: "Ticket price is not set for this event." });
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

const getAllEventRevenues = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const events = await Event.find(); // You can filter only approved events if needed

    const revenueData = await Promise.all(
      events.map(async (event) => {
        const bookingCount = await Booking.countDocuments({ eventId: event._id });
        const ticketPrice = event.ticketPrice || 0;
        const totalRevenue = bookingCount * ticketPrice;
        const organizerShare = totalRevenue * 0.8;
        const adminShare = totalRevenue * 0.2;

        return {
          eventId: event._id,
          eventTitle: event.title,
          bookingCount,
          ticketPrice,
          totalRevenue,
          organizerShare,
          adminShare,
        };
      })
    );

    res.status(200).json(revenueData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Initiate payment for booking
// 1. Initiate Payment
const initiatePayment = async (req, res) => {
  try {
    const { eventId, amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
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

// 2. Verify Payment and Create Booking
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId } = req.body;

    // Step 1: Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Step 2: Find Event and User
    const event = await Event.findById(eventId);
    const user = req.user;

    if (!event || !user) {
      return res.status(404).json({ message: "Event or user not found" });
    }

    // Step 3: Create and Save Booking
    const booking = new Booking({
      userId: user._id,
      eventId,
      ticketId: `ticket_${Date.now()}`,
      amount: event.ticketPrice,
      paymentStatus: "success",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    await booking.save(); // <- ✅ THIS is where data is saved to MongoDB

    // Step 4: Send Email
    await sendPaymentConfirmationEmail(
      user.email,
      user.name,
      event.title,
      booking.ticketId,
      event.ticketPrice,
      event.date
    );

    // Step 5: Respond
    res.status(200).json({
      success: true,
      message: "Payment verified and booking successful",
      booking: {
        ticketId: booking.ticketId,
        eventId: event._id,
        eventTitle: event.title,
        amount: event.ticketPrice,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
};

const getOrganizerRevenue = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const events = await Event.find({ organizer: organizerId });

    const revenues = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ eventId: event._id });

        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.amount, 0);
        const organizerShare = totalRevenue * 0.8;
        const adminShare = totalRevenue * 0.2;

        return {
          eventId: event._id,
          eventTitle: event.title,
          eventImage: event.eventImage,
          totalRevenue,
          organizerShare,
          adminShare,
        };
      })
    );

    res.status(200).json({ revenues });
  } catch (error) {
    console.error("Error calculating organizer revenue:", error);
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};



module.exports = { getEventRevenue, getAllEventRevenues ,initiatePayment, verifyPayment,getOrganizerRevenue };

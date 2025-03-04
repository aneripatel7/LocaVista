const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController"); 
const { authenticateUser, isAttendee } = require("../middleware/auth");

router.post("/bookings", authenticateUser, isAttendee, bookingController.bookEvent);
router.get("/my-bookings", authenticateUser, isAttendee, bookingController.getBookings);

module.exports = router;

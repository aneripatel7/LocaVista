const express = require("express");
const router = express.Router();
const { getEventRevenue,getAllEventRevenues,initiatePayment ,verifyPayment,getOrganizerRevenue} = require("../controllers/paymentController");
const { authenticateUser } = require("../middleware/auth");

// Define the route correctly
router.get("/:eventId/revenue", authenticateUser, getEventRevenue);
router.post("/initiate", authenticateUser, initiatePayment);
router.post("/verify-payment", authenticateUser, verifyPayment);
router.get('/admin/revenue-overview', authenticateUser, getAllEventRevenues);
router.get("/my-revenue", authenticateUser, getOrganizerRevenue);

module.exports = router;
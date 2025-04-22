const express = require("express");
const router = express.Router();
const { getEventRevenue,initiatePayment ,verifyPayment} = require("../controllers/paymentController");
const { authenticateUser } = require("../middleware/auth");

// Define the route correctly
router.get("/:eventId/revenue", authenticateUser, getEventRevenue);
router.post("/initiate", authenticateUser, initiatePayment);
router.post("/verify-payment", authenticateUser, verifyPayment);


module.exports = router;
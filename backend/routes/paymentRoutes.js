const express = require("express");
const router = express.Router();
const { getEventRevenue } = require("../controllers/paymentController");
const { authenticateUser } = require("../middleware/auth");

// Define the route correctly
router.get("/:eventId/revenue", authenticateUser, getEventRevenue);

module.exports = router;

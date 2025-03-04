const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController"); 
const { authenticateUser, isOrganizer, isAdmin } = require("../middleware/auth");

// Event Routes
router.post("/create", authenticateUser, isOrganizer, eventController.createEvent);
router.get("/all", authenticateUser, eventController.getAllEvents);  
router.get("/:id", authenticateUser, eventController.getEventById);  

module.exports = router;

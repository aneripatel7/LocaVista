const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController"); 
const { authenticateUser, isOrganizer, isAdmin } = require("../middleware/auth");

// Event Routes
router.post("/create", authenticateUser, isOrganizer, eventController.createEvent);
router.get("/all", authenticateUser, eventController.getAllEvents); 
router.get("/approved", eventController.getApprovedEvents);  
router.put("/:id/approve", authenticateUser, isAdmin, eventController.approveEvent);
router.delete("/:id/reject", authenticateUser, isAdmin, eventController.rejectEvent);
router.get("/:id", eventController.getEventById);

module.exports = router;

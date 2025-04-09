// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController"); 
const { authenticateUser, isOrganizer, isAdmin } = require("../middleware/auth");
const upload = require("../config/multerConfig"); // Multer configuration

// Event Routes
router.post("/create", authenticateUser, isOrganizer, upload.single("eventImage"), eventController.createEvent);
router.get("/all", authenticateUser, eventController.getAllEvents); 
router.get("/approved", eventController.getApprovedEvents);  
router.get("/category/:category", eventController.getEventsByCategory);
router.put("/:id/approve", authenticateUser, isAdmin, eventController.approveEvent);
router.delete("/:id/reject", authenticateUser, isAdmin, eventController.rejectEvent);
router.get("/past", eventController.getPastEvents);
router.get("/:id", eventController.getEventById);


module.exports = router;
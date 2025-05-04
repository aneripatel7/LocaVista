// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateUser, isOrganizer, isAdmin } = require("../middleware/auth");
const upload = require("../config/multerConfig");

// ------------------- Event Routes -------------------

// ✅ Organizer routes
router.post("/create", authenticateUser, isOrganizer, upload.single("eventImage"), eventController.createEvent);
router.get("/my-events", authenticateUser, isOrganizer, eventController.getMyEvents);
router.put("/:id", authenticateUser, isOrganizer, eventController.updateEvent);
router.delete("/:id", authenticateUser, isOrganizer, eventController.deleteEvent);

// ✅ Admin routes
router.get("/pending", authenticateUser, isAdmin, eventController.getPendingEvents);
router.put("/:id/approve", authenticateUser, isAdmin, eventController.approveEvent);
router.delete("/:id/reject", authenticateUser, isAdmin, eventController.rejectEvent);

// ✅ Public and authenticated user routes
router.get("/all", authenticateUser, eventController.getAllEvents);
router.get("/approved", eventController.getApprovedEvents);
router.get("/category/:category", eventController.getEventsByCategory);
router.get("/past", eventController.getPastEvents);

// ✅ Dynamic route LAST to avoid conflicts
router.get("/:id", eventController.getEventById);


module.exports = router;

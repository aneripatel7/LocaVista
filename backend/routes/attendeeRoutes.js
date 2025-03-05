const express = require("express");
const router = express.Router();
const { authenticateUser, isAttendee } = require("../middleware/auth");
const { updateProfile, changePassword } = require("../controllers/attendeeController");
const upload = require("../config/multerConfig");

// Update profile (with optional profile picture upload)
router.put("/profile", authenticateUser, isAttendee, upload.single("profilePicture"), updateProfile);

// Change password
router.put("/change-password", authenticateUser, changePassword);

module.exports = router;





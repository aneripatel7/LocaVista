const express = require("express");
const router = express.Router();
const { authenticateUser, isAttendee } = require("../middleware/auth");
const { updateProfile, changePassword } = require("../controllers/attendeeController");
const upload = require("../config/multerConfig");


// Change password
router.put("/change-password", authenticateUser, changePassword);

module.exports = router;





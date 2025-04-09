const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerAttendee, loginAttendee, logoutUser, forgotPassword,verifyOTP, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register-attendee", registerAttendee);
router.post("/login-attendee", loginAttendee);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post("/reset-password", resetPassword);


module.exports = router;
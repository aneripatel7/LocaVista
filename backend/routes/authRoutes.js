const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerAttendee, loginAttendee, logoutUser, forgotPassword, resetPassword,resetPasswordUser, forgotPasswordUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register-attendee", registerAttendee);
router.post("/login-attendee", loginAttendee);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-password-user", forgotPasswordUser);
router.post("/reset-password-user", resetPasswordUser);

module.exports = router;


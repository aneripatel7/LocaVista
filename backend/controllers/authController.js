const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Attendee = require("../models/Attendee");
require('dotenv').config();
const validator = require("validator");
const sendEmail = require('../utils/sendEmail');
const ResetToken  = require('../models/PasswordResetOTP');
const crypto = require('crypto');

// ✅ Function to Validate Email with Messages
const validateEmail = (email) => {
  const validDomains = ["com", "net", "org", "edu", "gov", "in"];
  const roleBasedEmails = ["admin", "support", "info", "noreply", "contact", "help", "sales"];
  const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "dispostable.com"];
  const testDomains = ["example.com", "test.com", "demo.com", "fakeemail.com"];

  if (!validator.isEmail(email)) {
    return { valid: false, message: "Invalid email format." };
  }

  const emailParts = email.split("@");
  if (emailParts.length !== 2) return { valid: false, message: "Invalid email structure." };

  const [localPart, domain] = emailParts;
  const domainParts = domain.split(".");

  if (domainParts.length < 2) return { valid: false, message: "Email domain is not valid." };

  const topLevelDomain = domainParts.pop();
  const baseDomain = domainParts.join(".");

  if (!validDomains.includes(topLevelDomain)) {
    return { valid: false, message: "Only real business, education, and organization emails are allowed." };
  }

  if (disposableDomains.includes(domain)) {
    return { valid: false, message: "Disposable emails are not allowed." };
  }

  if (roleBasedEmails.includes(localPart)) {
    return { valid: false, message: "Role-based emails (admin, support, etc.) should not be used for personal accounts." };
  }

  if (testDomains.includes(domain)) {
    return { valid: false, message: "Test or example emails are not allowed for registration." };
  }

  return { valid: true, message: "Valid email." };
};

// ✅ Function to Validate Password
const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must include at least one lowercase letter." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must include at least one number." };
  }
  if (!/[@$!%*?&]/.test(password)) {
    return { valid: false, message: "Password must include at least one special character (@$!%*?&)." };
  }
  return { valid: true, message: "Valid password." };
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // 🔐 Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Registered successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Register Attendee
exports.registerAttendee = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    let attendee = await Attendee.findOne({ email });
    if (attendee) return res.status(400).json({ message: "Attendee already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    attendee = new Attendee({ name, email, password: hashedPassword });
    await attendee.save();

    // 🔐 Generate JWT Token
    const token = jwt.sign({ id: attendee._id, email: attendee.email, role: "attendee" }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Attendee registered successfully!",
      token,
      user: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        role: "attendee"
      }
    });
  } catch (err) {
    console.error("Register Attendee Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Login Admin/Organizer
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token as a response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Login Attendee
exports.loginAttendee = async (req, res) => {
  const { email, password } = req.body;
  try {
    const attendee = await Attendee.findOne({ email });
    if (!attendee) return res.status(400).json({ message: "Attendee not found" });

    // If attendee registered via Google, they won't have a password
    if (!attendee.password) {
      return res.status(400).json({ message: "This account is linked with Google. Please login using Google." });
    }

    const isMatch = await bcrypt.compare(password, attendee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: attendee._id, email: attendee.email, role: 'attendee' }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      attendee: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        profilePicture: attendee.profilePicture,
        interests: attendee.interests
      }
    });
  } catch (err) {
    console.error("Login Attendee Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Logout User
exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    // 3. Set OTP expiry (15 mins)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Save or update reset token
    await ResetToken.findOneAndUpdate(
      { userId: user._id },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // 5. Send email with OTP
    await sendEmail(user.email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpRecord = await PasswordResetOTP.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() } // not expired
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Optionally delete the OTP now (one-time use)
    await PasswordResetOTP.deleteMany({ userId: user._id });

    // Respond with a success message or a temporary token if you want extra security
    res.status(200).json({ message: 'OTP verified successfully', userId: user._id });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Reset Password for Admin/Organizer (User model)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if ResetToken exists
    const resetToken = await ResetToken.findOne({ userId: user._id, otp });
    if (!resetToken) return res.status(400).json({ message: "Invalid OTP" });

    // Check if OTP expired
    if (resetToken.expiresAt < Date.now()) {
      await ResetToken.deleteOne({ _id: resetToken._id }); // delete expired token
      return res.status(400).json({ message: "OTP expired" });
    }

    // Update user password
    user.password = newPassword;
    await user.save();

    // Delete the OTP token
    await ResetToken.deleteOne({ _id: resetToken._id });

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error); // 👈 LOG the actual error
    return res.status(500).json({ message: "Server error" });
  }
};
     
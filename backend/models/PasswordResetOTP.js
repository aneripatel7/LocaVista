const mongoose = require('mongoose');

const passwordResetOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('PasswordResetOtp', passwordResetOtpSchema);

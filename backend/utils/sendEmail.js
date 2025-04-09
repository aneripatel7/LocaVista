const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail from .env
        pass: process.env.EMAIL_PASS        // App password from .env
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;

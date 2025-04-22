const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Function to send a confirmation email
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail from .env
        pass: process.env.EMAIL_PASS, // App password from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error.message}`);
    throw error;
  }
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = async (
  userEmail,
  userName,
  eventTitle,
  ticketId,
  amount,
  eventDate
) => {
  const subject = `🎫 Booking Confirmed: ${eventTitle}`;
  const message = `
Hello ${userName},

Your booking for "${eventTitle}" is confirmed!

📅 Date: ${new Date(eventDate).toDateString()}
🎟️ Ticket ID: ${ticketId}
💰 Amount Paid: ₹${amount}

Thank you for booking with Locavista!

- Team Locavista
`;

  await sendEmail(userEmail, subject, message);
};

module.exports = {
  sendEmail,
  sendPaymentConfirmationEmail, // Export the new payment confirmation function
};

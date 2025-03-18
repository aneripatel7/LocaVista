const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail", // You can use SendGrid, Mailgun, or Amazon SES
    auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS   // App password or API key
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
};

module.exports = sendEmail;

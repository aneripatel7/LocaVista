const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes"); 
const attendeeRoutes = require("./routes/attendeeRoutes");
const upload = require("./config/multerConfig");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");

require("dotenv").config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/book", bookingRoutes);  
app.use("/api/attendee", attendeeRoutes);
app.use("/api/payments", paymentRoutes);

//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.get("/api/categories", (req, res) => {
  const categories = [
    "Festival", "Theatre", "Concerts", "Arts", "Health", "Gaming",
    "Tech & Innovation", "Business", "Sports", "Food & Drink",
    "Comedy", "Book Fairs"
  ];
  res.json(categories);
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = upload;
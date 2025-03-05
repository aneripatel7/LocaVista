const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes"); 
const attendeeRoutes = require("./routes/attendeeRoutes");
const upload = require("./config/multerConfig");

require("dotenv").config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/book", bookingRoutes);  
app.use("/api/attendee", attendeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = upload;


const mongoose = require("mongoose");

// List of valid event categories
const validCategories = [
    "Festival", "Theatre", "Concerts", "Arts", "Health",
    "Gaming", "Tech & Innovation", "Business", "Sports",
    "Food & Drink", "Comedy", "Book Fairs"];

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { 
        type: Date, 
        required: true, 
        get: function(value) {
            return value ? value.toISOString().split("T")[0] : null; // ✅ Ensures valid date format (YYYY-MM-DD)
        }
    },
    location: { type: String, required: true },
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false },
    ticketPrice: { type: Number, required: true },
    eventImage: { 
        type: String,
        set: function (imagePath) {
            if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image"; 
            if (imagePath.startsWith("http")) return imagePath; 

            // ✅ Fix Windows Backslash Issue
            const fixedPath = imagePath.replace(/\\/g, "/"); 

            return `/uploads/${fixedPath.replace(/^\/?uploads\//, "")}`;
        }
    },     
    category: { 
        type: String, 
        required: [true, "Event category is required"], 
        enum: validCategories,
        set: function(value) { 
            if (!value) return "Uncategorized"; 
            return value.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        }
    }
    
}, { 
    toJSON: { getters: true, virtuals: true }, 
    toObject: { getters: true, virtuals: true }, 
    id: false
});

module.exports = mongoose.model("Event", EventSchema);
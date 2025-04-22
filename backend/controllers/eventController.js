const Event = require("../models/Event");
const formatImagePath = require("../utils/formatImagePath");

// List of valid categories (centralized)
const validCategories = [
    "Festival", "Theatre", "Concerts", "Arts", "Health", "Gaming",
    "Tech & Innovation", "Business", "Sports", "Food & Drink",
    "Comedy", "Book Fairs", "Film & Media",
];

// Function to normalize category input
const normalizeCategory = (category) => {
    if (!category) return null;
    const formatted = category.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    return validCategories.includes(formatted) ? formatted : null;
};

// Function to format date correctly
const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : null;
};

// Create Event (Organizer)
const createEvent = async (req, res) => {
    try {
        const { title, date, location, description, ticketPrice, category } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !date || !location || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const normalizedCategory = normalizeCategory(category);
        if (!normalizedCategory) {
            return res.status(400).json({ message: "Invalid category." });
        }

        let eventImage = "https://via.placeholder.com/300x200?text=No+Image";
        if (req.file) {
            eventImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const event = new Event({
            title,
            date,
            location,
            description,
            ticketPrice,
            category: normalizedCategory,
            organizer: req.user._id,
            eventImage,
            approved: false
        });

        await event.save();

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get all events (Admin only)
const getAllEvents = async (req, res) => {
    try {
        // Ensure the user is authenticated and has the correct role
        if (!req.user || (req.user.role !== "admin" && req.user.role !== "organizer")) {
            return res.status(403).json({ message: "Forbidden: Only admins and organizers can view all events." });
        }

        // Fetch all events from the database
        const events = await Event.find();

        // Format response
        const formattedEvents = events.map(event => ({
            ...event._doc,
            date: formatDate(event.date),
            eventImage: formatImagePath(event.eventImage),
        }));

        // Return the response
        res.status(200).json({ success: true, events: formattedEvents });
    } catch (error) {
        console.error("Error fetching all events:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({
            ...event._doc,
            date: formatDate(event.date),
            eventImage: formatImagePath(event.eventImage)
        });
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Approve an event (Admin Only)
const approveEvent = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admins can approve events." });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.approved = true;
        await event.save();

        res.status(200).json({ message: "Event approved successfully", event });
    } catch (error) {
        console.error("Error approving event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reject an event (Admin Only)
const rejectEvent = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Only admins can reject events." });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Event rejected and deleted successfully" });
    } catch (error) {
        console.error("Error rejecting event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch only approved events
const getApprovedEvents = async (req, res) => {
    try {
        const events = await Event.find({ approved: true }).select("title date location description ticketPrice eventImage category");
        const formattedEvents = events.map(event => ({
            ...event._doc,
            eventImage: formatImagePath(event.eventImage),
        }));
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching approved events:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get events by category
const getEventsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const normalizedCategory = normalizeCategory(category);
        if (!normalizedCategory) {
            return res.status(400).json({ message: "Invalid category." });
        }

        const events = await Event.find({ category: normalizedCategory, approved: true });

        res.status(200).json({
            events: events.map(event => ({
                ...event._doc,
                date: formatDate(event.date),
                eventImage: formatImagePath(event.eventImage)
            }))
        });
    } catch (error) {
        console.error("Error fetching events by category:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getPastEvents = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date
  
      const pastEvents = await Event.find({
        date: { $lt: today }, // Find events with dates in the past
        approved: true, // Only show approved events
      });
  
      res.status(200).json(pastEvents);
    } catch (error) {
      console.error("Error fetching past events:", error);
      res.status(500).json({ message: "Server error fetching past events" });
    }
  };  

  const updateEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Only the event's creator can update it
      if (event.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this event" });
      }
  
      // Update fields
      Object.assign(event, req.body);
      await event.save();
  
      res.status(200).json({ message: "Event updated successfully", event });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    approveEvent,
    rejectEvent,
    getApprovedEvents,
    getEventsByCategory,
    getPastEvents,
    updateEvent
};
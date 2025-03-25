import React, { useMemo } from "react";

// ✅ Function to format image URL correctly
const formatImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;

  // ✅ Fix Windows Backslash Issue in Frontend
  const fixedPath = imagePath.replace(/\\/g, "/"); 

  return `http://localhost:5000${fixedPath.replace(/^\/?uploads\//, "/uploads/")}`;
};



// ✅ Function to format event date
const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handles invalid date strings
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const EventCard = ({ event }) => {
  // ✅ UseMemo to optimize rendering performance
  const imageUrl = useMemo(() => formatImageUrl(event?.eventImage), [event?.eventImage]);
  const formattedDate = useMemo(() => formatDate(event?.date), [event?.date]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-80 transition hover:shadow-lg">
      {/* ✅ Event Image with Error Handling */}
      <img
         src={`http://localhost:5000${event.eventImage}`} alt={event.title}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        }}
      />


      <div className="p-4">
        {/* ✅ Event Name */}
        <h2 className="text-lg font-bold text-gray-800">{event?.name || "Unnamed Event"}</h2>

        {/* ✅ Event Category */}
        <p className="text-gray-600"><strong>Category:</strong> {event?.category || "Uncategorized"}</p>

        {/* ✅ Event Date */}
        <p className="text-gray-600">{formattedDate}</p>

        {/* ✅ Event Location */}
        <p className="text-gray-500">{event?.location || "Location not specified"}</p>
      </div>
    </div>
  );
};

export default EventCard;
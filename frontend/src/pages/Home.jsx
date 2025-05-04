import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEvents, fetchEventsByCategory } from "../api";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { category } = useParams(); // 🔹 Get category from URL

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        let eventData;
        if (category) {
          eventData = await fetchEventsByCategory(category); 
        } else {
          eventData = await fetchEvents(); 
        }

        // 🔹 Filter only upcoming and ongoing events
        const today = new Date();
        const filteredEvents = eventData.filter(event => new Date(event.date) >= today);

        setEvents(filteredEvents.length > 0 ? filteredEvents : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [category]); // 🔹 Refetch when category changes

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        {category ? `${category} Events` : "Upcoming & Ongoing Events"}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/event/${event._id}`)} // 🔹 Redirect to event details
            >
              <img
                src={
                  event.eventImage.startsWith("http")
                    ? event.eventImage
                    : `http://localhost:5000${event.eventImage}`
                }
                alt={event.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{event.title}</h2>
              <p className="text-sm text-gray-700 font-light">
                {event.category || "Uncategorized"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No upcoming events available.</p>
      )}
    </div>
  );
};

export default Home;
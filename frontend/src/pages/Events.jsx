import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      const today = new Date();

      // Filter future events only
      const upcomingEvents = data.filter(event => new Date(event.date) >= today);
      setEvents(upcomingEvents);
      setLoading(false);
    };

    loadEvents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/events/${event._id}`)}
            >
              <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> ₹{event.ticketPrice || 0}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default Events;

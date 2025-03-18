import React, { useEffect, useState } from "react";
import { fetchEvents } from "../api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
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
            <div key={event._id} className="card">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> ₹{event.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default Events;
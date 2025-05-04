
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all approved events (including past)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events/approved")
      .then((res) => setApprovedEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch booked events if logged in
  useEffect(() => {
    if (user && token) {
      axios
        .get("http://localhost:5000/api/book/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setBookedEvents(res.data.bookings))
        .catch((err) => {
          console.error("Error fetching booked events:", err);
          if (err.response?.status === 401) {
            localStorage.clear();
            navigate("/login");
          }
        });
    }
  }, [user, token, navigate]);

  const today = new Date();

  // Filter past events
  const pastEvents = approvedEvents.filter(
    (event) => new Date(event.date) < today
  );

  // Format any date safely
  const formatDate = (date) => {
    const d = new Date(date);
    return !isNaN(d) ? d.toLocaleDateString() : "Invalid Date";
  };

  // Avoid duplicates: filter past events that are already booked
  const bookedEventIds = new Set(bookedEvents.map((b) => b._id));
  const filteredPastEvents = pastEvents.filter(
    (event) => !bookedEventIds.has(event._id)
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Dashboard</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Logged-in attendee booked events */}
          {user && bookedEvents.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Booked Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {bookedEvents.map((booking) => (
                  <div key={booking._id} className="bg-white shadow p-4 rounded-lg">
                    {/* Show event image */}
                    <img
                      src={
                        booking.eventId.eventImage?.startsWith("http")
                          ? booking.eventId.eventImage
                          : `http://localhost:5000${booking.eventId.eventImage}`
                      }
                      alt={booking.eventId.title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <h4 className="text-lg font-bold mt-2">{booking.eventId.title}</h4>
                    <p>{formatDate(booking.eventId.date)}</p>
                    <p className="text-sm text-gray-600">
                      Booked for: {formatDate(booking.bookedAt)}
                    </p>
                    <p className="text-sm">{booking.eventId.location}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Past events for all (filtered if logged in) */}
          <h3 className="text-xl font-semibold mb-4">Past Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(user ? filteredPastEvents : pastEvents).map((event) => (
              <div key={event._id} className="bg-gray-50 shadow p-4 rounded-lg">
                {/* Show event image */}
                <img
                  src={
                    event.eventImage?.startsWith("http")
                      ? event.eventImage
                      : `http://localhost:5000${event.eventImage}`
                  }
                  alt={event.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="text-lg font-semibold mt-2">{event.title}</h4>
                <p>{formatDate(event.date)}</p>
                <p className="text-sm">{event.location}</p>
                <p className="text-red-600 text-sm font-medium">Event Ended</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

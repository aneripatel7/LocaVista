import React, { useState, useEffect } from "react";
import axios from "axios";

const EventBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/book/organizer-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data.events);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-700 font-medium">
          Loading bookings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Event Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No bookings found.
        </p>
      ) : (
        <div className="space-y-8">
          {bookings.map((event) => (
            <div
              key={event._id}
              className="bg-white border rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600">{event.location}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-medium text-gray-700 mb-2">
                  Attendees: {event.bookings}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventBookings;

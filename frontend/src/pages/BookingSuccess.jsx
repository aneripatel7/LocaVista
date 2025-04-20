import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const eventId = localStorage.getItem("eventId");
      if (!eventId) {
        setError("Event ID not found.");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        setError("Failed to fetch event details.");
        console.error("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
          Booking Successful!
        </h1>

        <p className="text-sm text-gray-600 mb-2 text-center">
          Your Booking ID: <span className="text-blue-500 font-semibold">ticket_{Date.now()}</span>
        </p>

        {event ? (
          <div className="mt-4">
            <p className="text-lg text-gray-700 mb-2">
              <strong>Event:</strong> {event.title}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Amount Paid:</strong> ₹{event.ticketPrice}
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center">{error || "Loading event details..."}</p>
        )}

        <p className="text-gray-600 text-sm mt-4 text-center">
          Thank you for booking with Locavista!
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;

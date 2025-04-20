import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/events/organizer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data.events);
      } catch (err) {
        setErrorMsg("Error fetching your events.");
      }
    };

    fetchEvents();
  }, []);

  const handleViewEvent = (eventId) => {
    navigate(`/event-details/${eventId}`); // Redirect to the Event Details page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Organizer Dashboard</h1>
      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Events</h2>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Total Payment</th>
              <th className="px-4 py-2 text-left">Organizer Payment</th>
              <th className="px-4 py-2 text-left">Admin Payment</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b">
                <td className="px-4 py-2">{event.name}</td>
                <td className="px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{event.status}</td>
                <td className="px-4 py-2">{event.totalPayment} INR</td>
                <td className="px-4 py-2">{(event.totalPayment * 0.8).toFixed(2)} INR</td>
                <td className="px-4 py-2">{(event.totalPayment * 0.2).toFixed(2)} INR</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewEvent(event._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerDashboard;

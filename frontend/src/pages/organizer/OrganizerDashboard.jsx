import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; // Corrected import path

const OrganizerDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(res.data.events);
      } catch (err) {
        console.error("Failed to fetch events", err);
        toast.error("Error fetching your events.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyEvents();
    }
  }, [token]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(events.filter((e) => e._id !== eventId));
      toast.success("Event deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete event.");
    }
  };

  if (loading) return <p className="text-center mt-8 text-lg">Loading your events...</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-semibold text-gray-900 mb-12 text-center">My Created Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You haven’t created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              {event.eventImage && (
                <div className="w-full h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={event.eventImage}
                    alt={event.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-m text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-m text-gray-600">{event.location}</p>
                <p className="text-lg font-semibold text-gray-900 mt-4">₹ {event.ticketPrice}</p>
                <p className={`text-sm font-medium mt-2 ${event.approved ? "text-green-600" : "text-yellow-600"}`}>
                  {event.approved ? "✅ Approved" : "⏳ Pending Approval"}
                </p>

                <div className="mt-2 justify-end flex  space-x-4">
                  {/* Edit Button - Pencil Icon */}
                  <button
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                    className="p-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  {/* Delete Button - Trash Icon */}
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;

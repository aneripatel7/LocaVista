import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const validCategories = [
  "Festival", "Theatre", "Concerts", "Arts", "Health",
  "Gaming", "Tech & Innovation", "Business", "Sports",
  "Food & Drink", "Comedy"
];

const EditEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    ticketPrice: "",
    category: "",
  });

  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth(); // ✅ use token from context

  useEffect(() => {
    const fetchEventData = async () => {
      if (location.state?.eventData) {
        const event = location.state.eventData;
        setFormData({
          title: event.title || "",
          date: event.date ? event.date.split("T")[0] : "",
          location: event.location || "",
          description: event.description || "",
          ticketPrice: event.ticketPrice || "",
          category: event.category || "",
        });
      } else {
        try {
          const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const event = response.data;
          setFormData({
            title: event.title || "",
            date: event.date ? event.date.split("T")[0] : "",
            location: event.location || "",
            description: event.description || "",
            ticketPrice: event.ticketPrice || "",
            category: event.category || "",
          });
        } catch (error) {
          setError("Failed to fetch event. Please try again.");
          console.error("Error fetching event details:", error);
        }
      }
    };

    if (token) {
      fetchEventData();
    } else {
      setError("Invalid or missing token. Please log in again.");
    }
  }, [id, location.state, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ticketPrice: parseFloat(formData.ticketPrice),
      };

      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/organizer/dashboard");
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid or expired token. Please log in again.");
      } else {
        setError(error.response?.data?.message || "Failed to update the event.");
      }
      console.error("Error updating event:", error.response || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Edit Event</h1>
      {error && (
        <div className="text-red-500 mb-4 text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-xl"
          >
            <option value="">Select a category</option>
            {validCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEvent;

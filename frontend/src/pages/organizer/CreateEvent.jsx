import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = [
  "Festival", "Theatre", "Concerts", "Arts", "Health",
  "Gaming", "Tech & Innovation", "Business", "Sports",
  "Food & Drink", "Comedy", "Book Fairs"
];

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    ticketPrice: "",
    category: "",
    eventImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (!formData.eventImage) {
      setMessage("❌ Please upload an event image.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post(
        "http://localhost:5000/api/events/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Event created successfully!");
      setIsSuccess(true);

      // Reset form
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        ticketPrice: "",
        category: "",
        eventImage: null,
      });

      // Navigate to organizer dashboard after short delay
      setTimeout(() => navigate("/organizer/dashboard"), 1000);
    } catch (err) {
      setMessage("❌ Failed to create event. " + (err.response?.data?.message || "Server error"));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Create New Event</h2>

      {message && (
        <div className={`mb-4 text-sm text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          name="ticketPrice"
          placeholder="Ticket Price"
          value={formData.ticketPrice}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="file"
          name="eventImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;

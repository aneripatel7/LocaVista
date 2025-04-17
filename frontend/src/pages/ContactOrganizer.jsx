// ContactOrganizer.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ContactOrganizer = () => {
  const { id } = useParams(); // organizerId
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    // Simulated user fetch from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({ name: storedUser.name, email: storedUser.email });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send message to organizer backend
    try {
      await fetch("http://localhost:5000/api/contact-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizerId: id, ...user, message }),
      });
      alert("Message sent to organizer!");
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Contact Organizer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={user.name}
          disabled
          className="border p-2 rounded bg-gray-100"
        />
        <input
          type="email"
          value={user.email}
          disabled
          className="border p-2 rounded bg-gray-100"
        />
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded"
          required
        ></textarea>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactOrganizer;

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Assuming you're fetching data from an API

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events or data related to admin
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events/approved", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents(response.data); // Set the events data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Check if events are loaded and not empty */}
     
     
    </div>
  );
};

export default AdminDashboard;

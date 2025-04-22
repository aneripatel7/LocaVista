import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/organizer/EventCard";  // Correct relative path
import CreateEventForm from "../../components/organizer/CreateEventForm";  // Correct relative path
import RevenueInfo from "../../components/organizer/RevenueInfo";  // Correct relative path
import EditEventModal from "../../components/organizer/EditEventModal";  // Correct relative path
import AttendeesModal from "../../components/organizer/AttendeesModal";  // Correct relative path

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events for the organizer
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events/organizer");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <CreateEventForm />
      {/* Check if there are events and map over them */}
      {events.length > 0 ? (
        events.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <p>No events found.</p>
      )}
      <RevenueInfo />
    </div>
  );
};

export default OrganizerDashboard;

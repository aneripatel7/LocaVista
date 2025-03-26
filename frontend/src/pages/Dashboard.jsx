import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/events/approved")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                setError("Failed to load events.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const today = new Date();
    const pastEvents = events.filter(event => new Date(event.date) < today); // Show only past events

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading past events...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                    <div 
                        key={event._id} 
                        className="bg-white shadow-md rounded-lg p-4 opacity-70 cursor-not-allowed"
                    >
                        <img 
                            src={event?.eventImage?.startsWith("http") ? event.eventImage : `http://localhost:5000${event.eventImage}`} 
                            alt={event.title} 
                            className="w-full h-40 object-cover rounded-md"
                        />
                        <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
                        <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        <p>{event.location}</p>
                        <p className="text-red-500 font-bold mt-2">Event Ended</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

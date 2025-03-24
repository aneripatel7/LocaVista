import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/events/${id}`)
            .then((response) => {
                setEvent(response.data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching event details:", error);
                setError("Failed to load event details. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 animate-pulse">Loading event details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
                ← Back
            </button>

            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Event Image with Fixed Frame */}
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                        src={
                            event?.eventImage?.startsWith("http")
                                ? event.eventImage
                                : `http://localhost:5000${event.eventImage}`
                        }
                        alt={event?.title || "Event Image"}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/500x300?text=No+Image")
                        }
                    />
                </div>

                {/* Event Details */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">{event?.title || "Untitled Event"}</h2>

                    <p className="text-gray-600">
                        <strong>Category:</strong> {event?.category?.name || event?.category || "Uncategorized"}
                    </p>

                    <p className="text-gray-600">
                        <strong>Date:</strong> {event?.date ? new Date(event.date).toLocaleDateString() : "TBA"}
                    </p>

                    <p className="text-gray-600">
                        <strong>Location:</strong> {event?.location || "Not specified"}
                    </p>

                    <p className="text-gray-600">
                        <strong>Price:</strong> {event?.ticketPrice ? `₹${event.ticketPrice}` : "Free"}
                    </p>

                    <p className="text-gray-600">
                        <strong>Description:</strong> {event?.description || "No description available."}
                    </p>

                    {/* Booking Button */}
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                        Book Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookingPage = () => {
    const { id } = useParams(); // Get event ID from URL
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/events/${id}`)
            .then((response) => {
                setEvent(response.data);
            })
            .catch(() => {
                setError("Failed to load event details.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleConfirmBooking = () => {
        axios
            .post("http://localhost:5000/api/book/bookings", {
                eventId: id,
                userId: "USER_ID", // Replace with logged-in user's ID
            })
            .then(() => {
                setBookingSuccess(true);
                setTimeout(() => navigate("/dashboard"), 2000); // Redirect after booking
            })
            .catch(() => {
                setError("Booking failed. Try again.");
            });
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Booking</h2>
            {bookingSuccess ? (
                <p className="text-green-600">Booking confirmed! Redirecting...</p>
            ) : (
                <>
                    <p><strong>Event:</strong> {event.title}</p>
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Price:</strong> {event.ticketPrice ? `₹${event.ticketPrice}` : "Free"}</p>
                    
                    <button
                        onClick={handleConfirmBooking}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Confirm Booking
                    </button>
                </>
            )}
        </div>
    );
};

export default BookingPage;

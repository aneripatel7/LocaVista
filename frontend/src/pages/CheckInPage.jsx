import React, { useState } from "react";
import axios from "axios";

const CheckInPage = () => {
    const [ticketId, setTicketId] = useState("");
    const [message, setMessage] = useState("");

    const handleCheckIn = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/book/check-in",
                { ticketId },
                { withCredentials: true }
            );

            setMessage(response.data.message);
        } catch (error) {
            console.error("Check-in error:", error.response?.data || error);
            setMessage(error.response?.data?.message || "Check-in failed.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold">Check-In Attendee</h2>
            <input
                type="text"
                placeholder="Enter Ticket ID"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="border p-2 rounded-lg mt-4"
            />
            <button onClick={handleCheckIn} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg">
                Check In
            </button>
            {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
        </div>
    );
};

export default CheckInPage;

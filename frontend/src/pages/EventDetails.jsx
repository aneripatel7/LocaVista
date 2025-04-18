import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/approved");
        if (event) {
          const filtered = res.data.filter(
            (e) => e._id !== event._id && e.category === event.category
          );
          setRelatedEvents(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching related events:", err);
      }
    };

    if (event) {
      fetchRelatedEvents();
    }
  }, [event]);

  const handleBookEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/book/bookings",
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingMessage(response.data.message);
      setIsBooked(true);
    } catch (error) {
      setBookingMessage(error.response?.data?.message || "Booking failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse">
        Loading event details...
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
    <div className="container mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm text-gray-700 hover:text-gray-900 transition flex items-center gap-2"
      >
        ← Back to Events
      </button>

      {/* Event Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="w-full aspect-[3/2] bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={
              event?.eventImage?.startsWith("http")
                ? event.eventImage
                : `http://localhost:5000${event.eventImage}`
            }
            alt={event?.title || "Event Image"}
            className="w-full h-full object-cover object-center"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/500x300?text=No+Image")
            }
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event?.title}</h1>

            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-4">
              {event?.category?.name || event?.category || "Uncategorized"}
            </span>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Date:</strong>{" "}
              {event?.date ? new Date(event.date).toLocaleDateString() : "TBA"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Location:</strong> {event?.location || "Not specified"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Price:</strong> {event?.ticketPrice ? `₹${event.ticketPrice}` : "Free"}
            </p>

            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Description:</strong> <br />
              {event?.description || "No description available."}
            </p>
          </div>

          {/* Booking Section */}
          <div className="mt-6">
            {!isBooked ? (
              <button
                onClick={handleBookEvent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Book Event
              </button>
            ) : (
              <p className="text-green-600 font-medium">You have successfully booked this event!</p>
            )}
            {bookingMessage && (
              <p className="mt-2 text-red-500 text-sm">{bookingMessage}</p>
            )}
          </div>
        </div>
      </div>

{/* You Might Also Like */}
{relatedEvents.length > 0 && (
  <div className="mt-16">
    <h2 className="text-xl font-semibold mb-4">You might also like</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {relatedEvents
        .filter((item) => new Date(item.date) > new Date()) // Only upcoming events
        .map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/event/${item._id}`)}
            className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={
                item.eventImage?.startsWith("http")
                  ? item.eventImage
                  : `http://localhost:5000${item.eventImage}`
              }
              alt={item.title}
              className="w-full h-48 object-cover"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/500x300?text=No+Image")
              }
            />
            <div className="p-3">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.location}</p>
            </div>
          </div>
        ))}
    </div>
  </div>
)}


      {/* Contact Organizer Section */}
      <div className="mt-16 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Have Questions?</h2>
        <p className="mb-4 text-gray-600">
          Feel free to reach out for more info about this event.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() =>
            navigate(`/contact-organizer/${event?.organizer?._id || event?.organizer}`)
          }
        >
          Contact Organizer
        </button>
      </div>
    </div>
  );
};

export default EventDetails;

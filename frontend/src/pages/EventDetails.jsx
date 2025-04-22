import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTicketSentModal, setShowTicketSentModal] = useState(false); // Track the ticket sent modal

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load event details.");
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

    if (event) fetchRelatedEvents();
  }, [event]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleConfirmBooking = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payments/initiate",
        { eventId: id, amount: event.ticketPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_WmSUWjlfCVCx0y",
        amount: data.order.amount,
        currency: "INR",
        name: "Locavista Events",
        description: event.title,
        image: "/logo.png",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payments/verify-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                eventId: id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setIsBooked(true);
              setShowTicketSentModal(true); // Show the ticket sent modal
              setTimeout(() => {
                navigate(`/dashboard`); // Redirect to dashboard after 2 seconds
              }, 2000);
            } else {
              setBookingMessage("Payment verification failed.");
            }
          } catch {
            setBookingMessage("Verification failed.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563EB" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setBookingMessage(err.response?.data?.message || "Booking failed.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const isExpired = event && new Date(event.date) < new Date();

  const handleBookEvent = () => {
    if (!token) return navigate("/login");
    if (isExpired) {
      setBookingMessage("This event has already ended.");
      return;
    }
    setShowConfirmModal(true);
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 relative">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm text-gray-700 hover:text-gray-900"
      >
        ← Back to Events
      </button>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={
            event.eventImage?.startsWith("http")
              ? event.eventImage
              : `http://localhost:5000${event.eventImage}`
          }
          alt={event.title}
          className="w-full h-75 object-cover object-center"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/500x300?text=No+Image")
          }
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {event?.category?.name || event?.category || "Uncategorized"}
            </span>

            <p className="text-sm mt-4 text-gray-600">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Price:</strong> ₹{event.ticketPrice}
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              <strong>Description:</strong> {event.description}
            </p>
          </div>

          <div className="mt-6">
            {isBooked ? (
              <p className="text-green-600 font-medium">
                You have already booked this event!
              </p>
            ) : (
              !isExpired && (
                <button
                  onClick={handleBookEvent}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Book Event
                </button>
              )
            )}
            {isExpired && (
              <p className="text-red-500 mt-2">This event has already ended.</p>
            )}
            {bookingMessage && (
              <p className="mt-2 text-sm text-red-500">{bookingMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">You might also like</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedEvents
              .filter((item) => new Date(item.date) > new Date())
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/event/${item._id}`)}
                  className="cursor-pointer bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={
                      item.eventImage?.startsWith("http")
                        ? item.eventImage
                        : `http://localhost:5000${item.eventImage}`
                    }
                    alt={item.title}
                    className="h-48 w-full object-cover"
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Confirm Your Booking
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Are you sure you want to book <span className="text-blue-600 font-medium">{event.title}</span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Sent Modal */}
      <AnimatePresence>
        {showTicketSentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Ticket Confirmation
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Your ticket has been sent to{" "}
                <span className="font-medium text-blue-600">{user?.email}</span>!
              </p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyBooked, setAlreadyBooked] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [modalMessage, setModalMessage] = useState(""); // Modal message content
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button flag

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("Error loading event. Please try again later.");
      }
    };

    const checkBooking = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/book/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const booked = res.data.find((booking) => booking.event._id === id);
        if (booked) setAlreadyBooked(booked);
      } catch (err) {
        console.error("Booking check failed:", err);
      }
    };

    fetchEvent();
    checkBooking();
  }, [id, token]);

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user?.name || !user?.email) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Disable the button to prevent multiple clicks
    setIsButtonDisabled(true);

    const razorpayLoaded = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!razorpayLoaded) return alert("Failed to load Razorpay");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/payments/initiate",
        { eventId: id, amount: event.ticketPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order } = response.data;

      const options = {
        key: "rzp_test_WmSUWjlfCVCx0y", // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "Locavista Booking",
        description: event.title,
        order_id: order.id,
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payments/verify-payment",
              { paymentResponse, orderId: order.id },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              const booking = verifyRes.data.booking;

              // Send the confirmation email
              await axios.post("http://localhost:5000/api/sendEmail/booking-confirmation", {
                email: user.email,
                name: user.name,
                eventTitle: event.title,
                ticketId: booking.ticketId,
                amount: event.ticketPrice,
                eventDate: event.date,
              });

              // Show modal with success message
              setModalMessage("Your event ticket has been sent to your email!");
              setShowModal(true);

              // Redirect to Dashboard after modal is closed
              setTimeout(() => {
                navigate("/dashboard", { state: { message: "Event booked successfully!" } });
              }, 3000); // Redirect after 3 seconds
            } else {
              setModalMessage("Payment verification failed.");
              setShowModal(true);
            }
          } catch (err) {
            console.error("Verification error:", err);
            setModalMessage("Payment verification failed.");
            setShowModal(true);
          } finally {
            setIsButtonDisabled(false); // Re-enable the button in case of error
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#00BFFF" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setModalMessage("Payment failed: " + response.error.description);
        setShowModal(true);
        setIsButtonDisabled(false); // Re-enable the button if payment fails
      });

      razorpay.open();
    } catch (err) {
      setError("Payment process error. Try again.");
      console.error("Payment error:", err);
      setIsButtonDisabled(false); // Re-enable the button if there’s an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm text-gray-700 hover:text-gray-900 transition flex items-center gap-2"
      >
        ← Back to Events
      </button>

      {event ? (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Price:</strong> ₹{event.ticketPrice}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              <strong>Description:</strong><br />{event.description}
            </p>

            {alreadyBooked ? (
              <>
                <p className="text-green-600 font-semibold mb-4">🎟 You’ve already booked this event.</p>
                <button
                  onClick={resendTicket}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Resend Ticket Email
                </button>
              </>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isButtonDisabled} // Disable the button during payment
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {isButtonDisabled ? "Processing..." : "Proceed to Payment"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Event details not found.</div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-center">{modalMessage}</h2>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPayment;
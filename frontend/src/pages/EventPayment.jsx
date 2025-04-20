import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("Error loading event. Please try again later.");
        console.error("Error loading event:", err);
      }
    };

    fetchEvent();
  }, [id]);

  // Load Razorpay script
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
    const token = localStorage.getItem("token");
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      console.error("Invalid user object in localStorage");
    }

    if (!token || !user || !user.name || !user.email) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const razorpayLoaded = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!razorpayLoaded) {
      alert("Failed to load Razorpay");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Backend API call to initiate payment
      const response = await axios.post(
        "http://localhost:5000/api/payments/initiate",
        {
          eventId: id,
          amount: event.ticketPrice * 100, // in paise (Razorpay expects amount in paise)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order } = response.data;

      const options = {
        key: "rzp_test_WmSUWjlfCVCx0y", // your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "Locavista Booking",
        description: event.title,
        order_id: order.id,
        handler: async function (paymentResponse) {
          // On success, you can handle the response, e.g., save payment info to the backend
          alert("Payment Successful!");

          // Backend call to verify payment and create a booking
          const paymentVerificationResponse = await axios.post(
            "http://localhost:5000/api/payments/verify-payment",
            {
              paymentResponse, // Pass the Razorpay payment response
              orderId: order.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // On successful verification, get booking details and navigate to success page
          if (paymentVerificationResponse.data.success) {
            const booking = paymentVerificationResponse.data.booking;
            navigate(`/booking-success/${booking.ticketId}`, { state: { booking } });
          } else {
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#00BFFF", // Custom theme color for Razorpay popup
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError("An error occurred during the payment process. Please try again.");
      console.error("Payment initiation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading payment...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

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
          <div className="p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Location:</strong> {event.location}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Price:</strong> ₹{event.ticketPrice}
            </p>

            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Description:</strong> <br />
              {event.description}
            </p>

            <div className="mt-6">
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Event details are unavailable.</div>
      )}
    </div>
  );
};

export default EventPayment;

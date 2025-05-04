import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const RevenuePage = () => {
  const { token } = useContext(AuthContext);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payments/my-revenue", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRevenues(res.data.revenues || []);
      } catch (err) {
        console.error("Error fetching revenue:", err);
        toast.error("Failed to load revenue data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRevenues();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading revenue breakdown...</p>;
  }

  if (!revenues.length) {
    return <p className="text-center mt-10 text-lg text-gray-600">No revenue data found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12">Revenue Breakdown</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {revenues.map((rev) => (
          <div
            key={rev.eventId}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            {rev.eventImage && (
              <img
                src={rev.eventImage}
                alt={rev.eventTitle}
                className="w-full h-52 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-2xl font-semibold text-center mb-1">{rev.eventTitle}</h2>
            <p className="text-sm text-gray-600 mb-2">Event ID: {rev.eventId}</p>

            <div className="mt-4 text-center space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Total Revenue:</span>{" "}
                <span className="text-green-600 font-bold">₹ {rev.totalRevenue}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">Organizer Share (80%):</span>{" "}
                <span className="text-blue-600 font-bold">₹ {rev.organizerShare}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">Admin Share (20%):</span>{" "}
                <span className="text-purple-700 font-bold">₹ {rev.adminShare}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenuePage;

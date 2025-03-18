import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventsByCategory } from "../api";

const CategoryPage = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEventsByCategory(category);
      console.log(`Events in ${category}:`, data); // Debugging
      setEvents(data);
      setLoading(false);
    };

    loadEvents();
  }, [category]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Events in {category}</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white shadow-md rounded-lg p-4">
              <img src={event.image || "https://via.placeholder.com/300x200"} alt={event.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-lg font-bold mt-2">{event.title}</h2>
              <p>{event.date}</p>
              <p className="text-gray-700">{event.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No events available in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;

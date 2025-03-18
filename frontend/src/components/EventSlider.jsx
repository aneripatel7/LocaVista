import React, { useEffect, useState } from "react";
import { fetchEvents } from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EventSlider = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format image URLs correctly
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image+Available"; 
    return `http://localhost:5000/${imagePath.replace(/\\/g, "/")}`; // Fix Windows backslashes
  };

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      console.log("Event Slider Data:", data); 
      if (data.length > 0) {
        setEvents(data);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-16">
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : events.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="rounded-lg overflow-hidden shadow-lg"
        >
          {events.map((event) => (
            <SwiperSlide key={event._id}>
              <div className="relative">
                <img
                  src={formatImageUrl(event.eventImage)}
                  alt={event.title}
                  className="w-full h-80 object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found"; }}
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-4 w-full">
                  <h2 className="text-lg font-bold">{event.title}</h2>
                  <p>{new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">No approved events available.</p>
      )}
    </div>
  );
};

export default EventSlider;

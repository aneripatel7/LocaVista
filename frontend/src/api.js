import axios from "axios";

// Set Backend Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Axios instance for uniform configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fetch event categories
export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data || []; // Ensure it returns an array
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Fetch only approved events
export const fetchEvents = async () => {
  try {
    const response = await api.get("/events/approved");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// ✅ Fetch past events (events before today's date)
export const fetchPastEvents = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/events/past");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching past events:", error);
    throw error;
  }
};

// ✅ Fetch event by ID
export const fetchEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
};

// ✅ Fetch events by category
export const fetchEventsByCategory = async (category) => {
  try {
    const response = await api.get(`/events/category/${encodeURIComponent(category)}`);
    
    return response.data?.events || response.data || [];
  } catch (error) {
    console.error(`Error fetching events for category "${category}":`, error);
    return [];
  }
};


// ✅ User authentication (Login)
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export default api;

import React, { useEffect, useState, useCallback } from "react";
import { fetchCategories } from "../api";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories and sort alphabetically
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      console.log("Fetched Categories:", data);
      
      // ✅ Sort categories alphabetically before setting state
      const sortedCategories = Array.isArray(data) && data.length > 0 
        ? data.sort((a, b) => a.localeCompare(b)) 
        : [];

      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
    setTimeout(() => toggleSidebar(), 150); // Small delay for smoother close
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 flex flex-col`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
          aria-label="Close Sidebar"
        >
          <FaTimes />
        </button>

        {/* Sidebar Header */}
        <h2 className="text-xl font-bold text-center uppercase tracking-wide border-b pb-2 mt-14">
          Event Categories
        </h2>

        {/* Category List */}
        <ul className="space-y-2 mt-4 flex-1 overflow-y-auto max-h-[80vh]">
          {loading ? (
            <li className="text-gray-400 text-center animate-pulse">Loading categories...</li>
          ) : error ? (
            <li className="text-red-400 text-center">{error}</li>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <li key={index} className="p-2 hover:bg-gray-700 rounded-md transition">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="block text-white w-full text-left font-medium focus:outline-none"
                >
                  {category}
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-center">No categories available.</li>
          )}
        </ul>
      </div>

      {/* Overlay for Sidebar */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30"
        />
      )}
    </>
  );
};

export default Sidebar;

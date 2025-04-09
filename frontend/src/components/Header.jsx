import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import ProfileDropdown from "./ProfileDropdown";

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const profileImage = user?.avatarUrl || defaultAvatar;

  const categories = [
    "Festival", "Theatre", "Concerts", "Arts",
    "Health", "Gaming", "Tech & Innovation",
    "Business", "Sports", "Food & Drink"
  ];

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between fixed w-full top-0 z-50">
      {/* Sidebar & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-700 hover:text-black focus:outline-none"
        >
          ☰
        </button>
        <Link to="/" className="text-2xl font-bold text-gray-900">
          LocaVista
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="text-gray-700 hover:text-black">
          Home
        </Link>
        <Link to="/services" className="text-gray-700 hover:text-black">
          Services
        </Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-black">
          Dashboard
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-black">
          Contact Us
        </Link>

      </nav>

      {/* Profile Icon or Sign In */}
      <div className="relative flex space-x-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="px-4 py-3 text-gray-800 text-center border-b">
                  <p className="font-semibold">{user.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 text-red-600 font-medium hover:bg-red-100 transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

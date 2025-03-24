import React from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between fixed w-full top-0 z-50">
      {/* Left - Sidebar Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-700 hover:text-black focus:outline-none"
        >
          <FaBars />
        </button>
        <Link to="/" className="text-2xl font-bold text-gray-900">LocaVista</Link>
      </div>

      {/* Center - Navigation Links (Hidden on Mobile) */}
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
        <Link to="/services" className="text-gray-700 hover:text-black">Services</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
        <Link to="/contact" className="text-gray-700 hover:text-black">Contact Us</Link>
      </nav>

      {/* Right - Login & Signup */}
      <div className="flex space-x-4">
        <Link to="/login" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Sign In
        </Link>
      </div>
    </header>
  );
};

export default Header;

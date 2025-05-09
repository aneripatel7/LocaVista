import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  const renderQuickLinks = () => {
    if (user?.role === "organizer") {
      return (
        <>
          <li>
            <Link to="/organizer/dashboard" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/organizer/create" className="hover:text-gray-400">
              Create Event
            </Link>
          </li>
          <li>
            <Link to="/organizer/revenue" className="hover:text-gray-400">
              Revenue Page
            </Link>
          </li>
          <li>
            <Link to="/organizer/event-bookings" className="hover:text-gray-400">
              Event Bookings
            </Link>
          </li>
        </>
      );
    } else if (user?.role === "attendee") {
      return (
        <>
          <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/services" className="hover:text-gray-400">Services</Link></li>
          <li><Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
          <li><Link to="/contact" className="hover:text-gray-400">Contact Us</Link></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/services" className="hover:text-gray-400">Services</Link></li>
          <li><Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
          <li><Link to="/contact" className="hover:text-gray-400">Contact Us</Link></li>
        </>
      );
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - About Section */}
          <div>
            <h2 className="text-xl font-bold">About LocaVista</h2>
            <p className="mt-2 text-gray-400">
              Your go-to platform for discovering and booking local events effortlessly.
            </p>
          </div>

          {/* Center - Quick Links */}
          <div>
            <h2 className="text-xl font-bold">Quick Links</h2>
            <ul className="mt-2 space-y-2">
              {renderQuickLinks()}
            </ul>
          </div>

          {/* Right - Contact & Social Media */}
          <div>
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="mt-2 text-gray-400">Email: support@locavista.com</p>
            <p className="text-gray-400">Phone: +91 98765 43210</p>

            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-2xl"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-2xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-2xl"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} LocaVista. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

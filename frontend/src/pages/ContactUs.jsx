import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="mt-16 bg-gray-100 min-h-screen flex flex-col items-center px-6 py-12">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
        <p className="text-gray-600 mt-2">We’d love to hear from you! Send us a message or contact us using the details below.</p>
      </div>

      {/* Contact Information & Form */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left - Contact Info */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <p className="text-gray-600 mb-6">Feel free to reach out to us through email, phone, or visit our office.</p>

          <div className="space-y-4">
            <p className="flex items-center text-gray-700">
              <FaEnvelope className="text-blue-600 mr-3" />
              support@locavista.com
            </p>
            <p className="flex items-center text-gray-700">
              <FaPhoneAlt className="text-blue-600 mr-3" />
              +91 98765 43210
            </p>
            <p className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-blue-600 mr-3" />
              123, Event Street, New Delhi, India
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-2xl hover:text-blue-800">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 text-2xl hover:text-pink-800">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl hover:text-blue-600">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Send Message
            </button>
          </form>

          {/* Success Message */}
          {status && <p className="text-green-600 text-center mt-3">{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

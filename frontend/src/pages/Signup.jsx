import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.png";
import { AuthContext } from "../context/AuthContext"; 

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("attendee"); // default
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useContext(AuthContext); // ✅ Access context

  // Get ?role=attendee or organizer from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get("role");
    if (selectedRole === "organizer" || selectedRole === "attendee") {
      setRole(selectedRole);
    }
  }, [location.search]);

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const apiUrl =
        role === "attendee"
          ? "http://localhost:5000/api/auth/register-attendee"
          : "http://localhost:5000/api/auth/register";

      const res = await axios.post(apiUrl, formData);

      const newUser =
        role === "organizer"
          ? { ...res.data.user, photoURL: defaultAvatar }
          : { ...res.data.attendee, photoURL: defaultAvatar };

      localStorage.setItem(role, JSON.stringify(newUser));
      setUser(newUser); // ✅ Update global context

      setSuccessMsg(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);

      setTimeout(() => {
        navigate(role === "organizer" ? "/organizerDashboard" : "/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {role === "organizer" ? "Organizer" : "Attendee"} Signup
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

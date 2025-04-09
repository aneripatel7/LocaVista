import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  // Corrected import for jwt-decode
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("attendee");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Determine role from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get("role");
    if (selectedRole === "organizer" || selectedRole === "attendee") {
      setRole(selectedRole);
    }
  }, [location.search]);

  // Handle form input changes
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
  
    // Check if email and password are provided
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
  
    try {
      // Adjust API endpoint based on role (attendee or organizer)
      const apiUrl =
        role === "attendee"
          ? "http://localhost:5000/api/auth/login-attendee"
          : "http://localhost:5000/api/auth/login";
  
      // Send login request
      const res = await axios.post(apiUrl, formData);
  
      // Handle successful response
      if (role === "attendee") {
        const attendee = res.data.attendee;
        localStorage.setItem("attendee", JSON.stringify(attendee));
        login(attendee);
        navigate("/dashboard");
      } else {
        const { token, user } = res.data;
        const decodedUser = user || jwtDecode(token);
  
        localStorage.setItem("token", token);
        localStorage.setItem("organizer", JSON.stringify(decodedUser));
        login(decodedUser);
  
        if (decodedUser.role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/organizerDashboard");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid credentials or server error.";
      setErrorMsg(message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          {role === "organizer" ? "Organizer" : "Attendee"} Login
        </h2>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            type="button"
            onClick={() => setRole("attendee")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              role === "attendee" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            Attendee
          </button>
          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              role === "organizer" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            Organizer
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-black mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {/* Links for Signup and Forgot Password */}
        <div className="text-center text-sm text-gray-600 mt-6 space-y-1">
          <p>
            Don’t have an account?{" "}
            <a
              href={`/signup?role=${role}`}
              className="text-blue-600 hover:underline"
            >
              Signup
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

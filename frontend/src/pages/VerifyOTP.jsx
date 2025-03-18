import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email from previous page

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage(res.data.message);
      navigate("/reset-password", { state: { email, otp } }); // Redirect to reset password
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;

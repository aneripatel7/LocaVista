import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email; // Email passed from ForgetPassword.jsx
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers

    let newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input box automatically if a digit is entered
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      let newOtp = [...otp];
      newOtp[index] = ""; // Clear current field
      setOtp(newOtp);

      // Move to previous input box if not the first field
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password-user", {
        email, // Email from ForgetPassword
        otp: otp.join(""), // Convert OTP array to string
        newPassword,
      });

      setMessage(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input Boxes */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="w-10 h-10 text-center border border-gray-400 rounded focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {/* New Password Input */}
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

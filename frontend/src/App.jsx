import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import Events from "./pages/Events";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventDetails from "./pages/EventDetails";
import ContactUs from "./pages/ContactUs";
import Services from "./pages/Services"; // ✅ Added Services Page

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Main Content */}
          <main
            className={`flex-1 p-6 mt-16 transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/services" element={<Services />} /> {/* ✅ Services Page */}
              <Route path="/category/:category" element={<Home />} /> {/* ✅ Category Filtering */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;

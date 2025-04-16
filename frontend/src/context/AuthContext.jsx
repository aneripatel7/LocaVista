import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load user from any available keys
    const attendee = localStorage.getItem("attendee");
    const organizer = localStorage.getItem("organizer");
    const storedToken = localStorage.getItem("token");

    const storedUser = attendee || organizer || localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid stored user data", e);
      }
    }

    if (storedToken && storedToken !== "undefined") {
      try {
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token:", err.message);
      }
    }
  }, []);

  const login = (userData, newToken) => {
    if (userData) {
      // Save based on role
      if (userData.role === "organizer") {
        localStorage.setItem("organizer", JSON.stringify(userData));
      } else {
        localStorage.setItem("attendee", JSON.stringify(userData));
      }
      localStorage.setItem("user", JSON.stringify(userData)); // fallback for future
      setUser(userData);
    }

    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("attendee");
    localStorage.removeItem("organizer");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

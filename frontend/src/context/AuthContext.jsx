import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const attendee = localStorage.getItem("attendee");
    const organizer = localStorage.getItem("organizer");
    const storedToken = localStorage.getItem("token");

    const storedUser = attendee || organizer;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid stored user data", e);
      }
    }

    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
  }, []);

  const login = (userData, newToken) => {
    if (userData) {
      if (userData.role === "organizer") {
        localStorage.setItem("organizer", JSON.stringify(userData));
      } else {
        localStorage.setItem("attendee", JSON.stringify(userData));
      }
      setUser(userData);
    }

    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

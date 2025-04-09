import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 

// ✅ Create the context
export const AuthContext = createContext();

// ✅ Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// ✅ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for stored user or token on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    // If token exists, try to decode and set the user
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setUser(decodedToken); // set the user based on decoded token
    } else if (storedUser) {
      // If user exists in localStorage but no token
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData); // Set the user in context
    localStorage.setItem('user', JSON.stringify(userData)); // Store user info
    localStorage.setItem('token', token); // Store the JWT token
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Default export (important if you use `import AuthProvider from "...`)
export default AuthProvider;

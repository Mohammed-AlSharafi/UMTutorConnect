import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('token', token);   // to be used with every request to private routes
  };

  // Logout function
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('token');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

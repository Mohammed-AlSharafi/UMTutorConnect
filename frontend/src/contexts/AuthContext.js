import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('user')) || null;
  });

  // Login function
  const login = (userData, token) => {
    setLoggedInUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem('token', token);   // to be used with every request to private routes
  };

  // Logout function
  const logout = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  const updateLoggedInUser = (updatedUser) => {
    setLoggedInUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = sessionStorage.getItem('user');
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, updateLoggedInUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

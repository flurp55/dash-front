import React, { createContext, useState } from 'react';
import { API_BASE_URL } from '../config/api'; // Adjust the import based on your project structure

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  const login = async (username, password) => {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Full URL will be:', `${API_BASE_URL}/api/login`);
  
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data.user));
  setIsAuthenticated(true);
};

  const logout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
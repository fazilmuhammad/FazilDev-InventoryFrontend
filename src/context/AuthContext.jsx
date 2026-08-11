import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      return JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user from local storage', e);
  }
  return null;
};

const getStoredToken = () => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    return token;
  }
  return null;
};

const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  try {
    delete axios.defaults.headers.common['Authorization'];
  } catch (e) {}
};

export const AuthProvider = ({ children }) => {
  // Initialize user synchronously from localStorage
  const [user, setUser] = useState(() => getStoredUser());
  // We no longer need a loading state because initialization is synchronous
  const loading = false;

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {}
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

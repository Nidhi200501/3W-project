import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Base URL from environment variable with fallback to live Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://threew-backend-hz5v.onrender.com';
axios.defaults.baseURL = API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tp_token') || '');
  const [loading, setLoading] = useState(true);

  // Set authorization header whenever token changes
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Auto-fetch user session on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (loginIdentifier, password) => {
    try {
      const response = await axios.post('/api/auth/login', { loginIdentifier, password });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('tp_token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, username, email, password });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('tp_token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('tp_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

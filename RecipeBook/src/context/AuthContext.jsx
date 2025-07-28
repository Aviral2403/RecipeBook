import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      // Note: The axios interceptor in axiosConfig.js will handle adding the token
      // but we still need to store it in localStorage
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user');
      // Clear invalid token
      setToken(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/api/auth/register', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      navigate('/recipes');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/api/auth/login', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      navigate('/recipes');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    setAuthToken(null);
    navigate('/');
  };

  // Initialize auth
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
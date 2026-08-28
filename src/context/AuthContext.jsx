import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register new user (sends OTP email to pending user)
  const register = async (fullName, email, password, phone) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/register', {
        fullName,
        email,
        password,
        phone,
      });

      return response;
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err.message || 'Registration failed');
      setError(errorMsg);
      throw err;
    }
  };

  // Verify email OTP and complete registration
  const verifyEmail = async (email, otp) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/verify-email', null, {
        params: { email, otp }
      });

      const { token, user: userData } = response;

      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return response;
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err.message || 'OTP Verification failed');
      setError(errorMsg);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err.message || 'Login failed');
      setError(errorMsg);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await apiClient.put('/auth/profile', userData);

      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);

      return response;
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : (err.message || 'Profile update failed');
      setError(errorMsg);
      throw err;
    }
  };

  // Login with pre-validated data (for Admin/Demo)
  const loginWithData = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
        loginWithData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pulsecare_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('pulsecare_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
        localStorage.setItem('pulsecare_user', JSON.stringify(data));
      } catch (err) {
        console.warn('Session verification failed:', err?.response?.data?.message || err.message);
        localStorage.removeItem('pulsecare_token');
        localStorage.removeItem('pulsecare_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('pulsecare_token', data.token);
    localStorage.setItem('pulsecare_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('pulsecare_token', data.token);
    localStorage.setItem('pulsecare_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('pulsecare_token');
    localStorage.removeItem('pulsecare_user');
    setUser(null);
    setToken(null);
  };

  // Update profile
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('pulsecare_user', JSON.stringify({ ...user, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isPatient: user?.role === 'patient',
        isDoctor: user?.role === 'doctor',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

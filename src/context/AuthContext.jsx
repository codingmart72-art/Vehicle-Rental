import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vrs_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo customer profile
    return {
      id: 'usr-cust-1',
      name: 'Alex Mercer',
      email: 'customer@demo.com',
      role: 'CUSTOMER',
      licenseStatus: 'VERIFIED',
    };
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vrs_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vrs_current_user');
    }
  }, [user]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      alert('Your session has expired or is unauthorized. Please log in again.');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.authenticateUser(email, password);
      localStorage.setItem('vrs_auth_token', data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.registerCustomer(userData);
      localStorage.setItem('vrs_auth_token', data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logoutUser();
    setUser(null);
  };

  // Easy Role Switcher for instant testing across all 4 roles
  const switchRole = (newRole) => {
    let updated = { ...user, role: newRole };
    if (newRole === 'CUSTOMER') {
      updated.id = 'usr-cust-1';
      updated.name = 'Alex Mercer';
      updated.email = 'customer@demo.com';
      updated.licenseStatus = 'VERIFIED';
    } else if (newRole === 'VEHICLE_OWNER') {
      updated.id = 'usr-owner-1';
      updated.name = 'Apex Mobility Fleet';
      updated.email = 'owner@demo.com';
    } else if (newRole === 'STAFF') {
      updated.id = 'usr-staff-1';
      updated.name = 'Sarah Connor (Staff)';
      updated.email = 'staff@demo.com';
    } else if (newRole === 'ADMIN') {
      updated.id = 'usr-admin-1';
      updated.name = 'System Administrator';
      updated.email = 'admin@demo.com';
    }
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

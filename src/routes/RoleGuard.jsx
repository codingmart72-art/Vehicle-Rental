import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        padding: '32px',
        textAlign: 'center',
      }} className="glass-card">
        <ShieldAlert size={64} color="#f43f5e" style={{ marginBottom: '16px' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px 0' }}>
          Your active role (<strong>{user.role}</strong>) does not have permission to view this module.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
          Please use the Role Switcher banner at the top of the screen to switch to an allowed role (<strong>{allowedRoles.join(', ')}</strong>) for testing.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;

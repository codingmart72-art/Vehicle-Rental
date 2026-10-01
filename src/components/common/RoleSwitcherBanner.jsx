import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Wrench, Crown, Eye } from 'lucide-react';

export const RoleSwitcherBanner = () => {
  const { user, switchRole } = useAuth();

  const roles = [
    { key: 'CUSTOMER', label: 'Customer', icon: User, color: '#6366f1' },
    { key: 'VEHICLE_OWNER', label: 'Vehicle Owner', icon: Crown, color: '#10b981' },
    { key: 'STAFF', label: 'Staff Inspector', icon: Wrench, color: '#f59e0b' },
    { key: 'ADMIN', label: 'Administrator', icon: ShieldCheck, color: '#ec4899' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
      padding: '8px 24px',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
        <Eye size={16} />
        <span style={{ fontWeight: 600 }}>Frontend Preview Switcher:</span>
        <span style={{ color: 'var(--text-muted)' }}>Simulate Member 1 Role View:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user?.role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => switchRole(r.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                border: isActive ? `1px solid ${r.color}` : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? `${r.color}25` : 'rgba(255,255,255,0.05)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} color={isActive ? r.color : 'inherit'} />
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSwitcherBanner;

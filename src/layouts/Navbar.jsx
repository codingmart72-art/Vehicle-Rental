import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Car, Shield, Compass, Tag, User, LogOut, LogIn, UserPlus,
  LayoutDashboard, FileCheck, ClipboardList, Settings, CheckCircle2, AlertCircle
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          background: 'var(--gradient-brand)',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          boxShadow: '0 0 15px rgba(99,102,241,0.5)'
        }}>
          <Car size={24} color="#ffffff" />
        </div>
        <div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
            Velocity<span style={{ color: 'var(--accent-primary)' }}>Rent</span>
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.1em' }}>
            SECURE PLATFORM
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-muted)',
          textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
        }}>
          <Compass size={16} /> Home
        </Link>

        <Link to="/search" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: isActive('/search') ? 'var(--accent-primary)' : 'var(--text-muted)',
          textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
        }}>
          <Car size={16} /> Vehicles
        </Link>

        <Link to="/offers" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: isActive('/offers') ? 'var(--accent-primary)' : 'var(--text-muted)',
          textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
        }}>
          <Tag size={16} /> Festival Offers
        </Link>

        {/* Role Specific Quick Links */}
        {user?.role === 'CUSTOMER' && (
          <>
            <Link to="/customer/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: isActive('/customer/dashboard') ? 'var(--accent-primary)' : 'var(--text-muted)',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>

            <Link to="/customer/license" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: user?.licenseStatus === 'VERIFIED' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              {user?.licenseStatus === 'VERIFIED' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              License ({user?.licenseStatus || 'UNVERIFIED'})
            </Link>
          </>
        )}

        {user?.role === 'VEHICLE_OWNER' && (
          <Link to="/owner/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: isActive('/owner/dashboard') ? 'var(--accent-emerald)' : 'var(--text-muted)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
          }}>
            <LayoutDashboard size={16} /> Owner Hub
          </Link>
        )}

        {user?.role === 'STAFF' && (
          <Link to="/staff/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: isActive('/staff/dashboard') ? 'var(--accent-amber)' : 'var(--text-muted)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
          }}>
            <FileCheck size={16} /> Staff Queue
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: isActive('/admin/dashboard') ? 'var(--accent-rose)' : 'var(--text-muted)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
          }}>
            <Settings size={16} /> Admin Console
          </Link>
        )}
      </div>

      {/* User Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{user.role}</div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              title="Logout session"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              <LogIn size={15} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              <UserPlus size={15} /> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LogIn, Lock, Mail, Eye, EyeOff, ShieldCheck, User, Crown, Wrench } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('customer@demo.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please provide both email and password', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}! Logged in as ${user.role}.`, 'success');
      
      // Redirect based on role or original destination
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STAFF') navigate('/staff/dashboard');
      else if (user.role === 'VEHICLE_OWNER') navigate('/owner/dashboard');
      else navigate(from);
    } catch (err) {
      addToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail, roleName) => {
    setEmail(demoEmail);
    setPassword('password123');
    addToast(`Selected demo credentials for ${roleName}`, 'info');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '40px auto 0 auto' }}>
      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'var(--gradient-brand)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)'
          }}>
            <Lock size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Account Authentication</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Access protected modules with role-based JWT authentication
          </p>
        </div>

        {/* Demo Quick-Fill Selectors */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick Demo Login Accounts:
          </div>
          <div className="grid-cols-2" style={{ gap: '8px' }}>
            <button type="button" onClick={() => handleQuickDemo('customer@demo.com', 'Customer')} className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'flex-start' }}>
              <User size={13} color="#6366f1" /> Customer
            </button>
            <button type="button" onClick={() => handleQuickDemo('owner@demo.com', 'Vehicle Owner')} className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'flex-start' }}>
              <Crown size={13} color="#10b981" /> Owner
            </button>
            <button type="button" onClick={() => handleQuickDemo('staff@demo.com', 'Staff Inspector')} className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'flex-start' }}>
              <Wrench size={13} color="#f59e0b" /> Staff
            </button>
            <button type="button" onClick={() => handleQuickDemo('admin@demo.com', 'Administrator')} className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'flex-start' }}>
              <ShieldCheck size={13} color="#ec4899" /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="glass-input"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '10px' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            Don't have a customer account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Register Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

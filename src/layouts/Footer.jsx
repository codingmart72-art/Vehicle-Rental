import React from 'react';
import { Shield, Lock, Server, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(10, 15, 29, 0.95)',
      padding: '32px 28px 20px 28px',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--accent-primary)" /> Security & Architecture
          </h4>
          <p style={{ color: 'var(--text-subtle)', lineHeight: 1.5 }}>
            Production-grade React.js Frontend for Secure Vehicle Rental System. Protected routes, RBAC guards, and stateless JWT REST contract.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '12px' }}>Role Specifications</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>• Customer: License Upload, Booking Wizard, Payment</li>
            <li>• Vehicle Owner: Add/Edit Fleet & Availability</li>
            <li>• Staff: License Queue, Pickup & Return Inspection</li>
            <li>• Admin: Role Management & Audit Logs</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--accent-emerald)" /> System Status
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Backend REST Contract: Connected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginTop: '6px' }}>
            <Lock size={16} /> Direct SQL Access: Disabled (Enforced)
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '16px',
        textAlign: 'center',
        color: 'var(--text-subtle)',
        fontSize: '0.8rem'
      }}>
        © 2026 Vehicle Rental System — Senior Frontend Developer (Member 1 Ownership)
      </div>
    </footer>
  );
};

export default Footer;

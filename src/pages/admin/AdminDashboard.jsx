import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { adminService } from '../../services/adminService';
import { offerService } from '../../services/offerService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  ShieldCheck, Users, Car, Tag, ShieldAlert, FileText, Settings,
  UserCheck, UserX, PlusCircle, Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Offer Form State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [newOfferCode, setNewOfferCode] = useState('SPRING20');
  const [newOfferTitle, setNewOfferTitle] = useState('Spring Break Special');
  const [newOfferDesc, setNewOfferDesc] = useState('20% discount on all rentals');
  const [newOfferDiscount, setNewOfferDiscount] = useState(20);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const uData = await adminService.getUsers();
      setUsers(uData);
      const oData = await offerService.getFestivalOffers();
      setOffers(oData);
      const logs = await adminService.getAuditLogs();
      setAuditLogs(logs);
      const sec = await adminService.getSecurityEvents();
      setSecurityEvents(sec);
    } finally {
      setLoading(false);
    }
  };

  // Change Role Handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.assignRole(userId, newRole, user);
      addToast(`Role updated to ${newRole}`, 'success');
      fetchAdminData();
    } catch (err) {
      addToast('Failed to update role', 'error');
    }
  };

  // User Deactivation / Activation Handler
  const handleToggleStatus = async (u) => {
    const nextStatus = u.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    try {
      await adminService.updateUserStatus(u.id, nextStatus, user);
      addToast(`User ${u.email} account status set to ${nextStatus}`, 'success');
      fetchAdminData();
    } catch (err) {
      addToast('Failed to update user status', 'error');
    }
  };

  // Create Promo Code Handler
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      await offerService.createOffer({
        code: newOfferCode,
        title: newOfferTitle,
        description: newOfferDesc,
        discountPercent: Number(newOfferDiscount),
        minDays: 2,
        validUntil: '2026-12-31',
      }, user);

      addToast(`Promo code ${newOfferCode} created!`, 'success');
      setOfferModalOpen(false);
      fetchAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to create offer', 'error');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin System Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            User role management, promo code configuration, audit stream & security logs
          </p>
        </div>
        <button onClick={() => setOfferModalOpen(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <PlusCircle size={18} /> + Create Festival Offer
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid-cols-4" style={{ gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Accounts</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{users.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>System Users</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Promo Codes</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{offers.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Festival Discounts</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Audit Events Logged</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{auditLogs.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Tracked REST Actions</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Security Alerts</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{securityEvents.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>RBAC & Login Stream</div>
        </div>
      </div>

      {/* Submodule Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} /> User & Role Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`btn ${activeTab === 'offers' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Tag size={16} /> Festival Offers ({offers.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FileText size={16} /> System Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ShieldAlert size={16} /> Security Alerts ({securityEvents.length})
        </button>
      </div>

      {/* TAB 1: User & Role Management */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>User Accounts & RBAC Role Assignment</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '12px' }}>Account Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Assigned Role</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 700, color: '#fff' }}>{u.name}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="glass-input"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: '160px' }}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="VEHICLE_OWNER">VEHICLE_OWNER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Festival Offers Management */}
      {activeTab === 'offers' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Configured Festival Offers</h3>
          <div className="grid-cols-3" style={{ gap: '20px' }}>
            {offers.map((o) => (
              <div key={o.id} className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>{o.code}</div>
                <h4 style={{ color: '#fff', marginBottom: '6px' }}>{o.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{o.description}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{o.discountPercent}% OFF</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Audit Logs Stream */}
      {activeTab === 'audit' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>System Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map((log) => (
              <div key={log.id} className="glass-panel" style={{ padding: '14px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>[{log.action}]</span>{' '}
                  <span style={{ color: '#fff' }}>{log.details}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    Actor: {log.actor} ({log.role}) • IP: {log.ipAddress}
                  </div>
                </div>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Security Events Stream */}
      {activeTab === 'security' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Security Events & Monitoring</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {securityEvents.map((sec) => (
              <div key={sec.id} className="glass-panel" style={{ padding: '14px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ fontWeight: 700, color: sec.severity === 'HIGH' ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                    [{sec.type}]
                  </span>{' '}
                  <span style={{ color: '#fff' }}>{sec.description}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    User: {sec.user} • Origin IP: {sec.ip}
                  </div>
                </div>
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                  {new Date(sec.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Promo Code Modal */}
      <Modal isOpen={offerModalOpen} onClose={() => setOfferModalOpen(false)} title="Create New Festival Promo Code">
        <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Promo Code *</label>
            <input type="text" value={newOfferCode} onChange={(e) => setNewOfferCode(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Offer Title *</label>
            <input type="text" value={newOfferTitle} onChange={(e) => setNewOfferTitle(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Description</label>
            <textarea value={newOfferDesc} onChange={(e) => setNewOfferDesc(e.target.value)} className="glass-input" rows="2" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Discount Percentage (%) *</label>
            <input type="number" value={newOfferDiscount} onChange={(e) => setNewOfferDiscount(e.target.value)} className="glass-input" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '8px' }}>
            Publish Festival Offer
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

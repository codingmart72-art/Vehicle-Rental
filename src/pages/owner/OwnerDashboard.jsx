import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { vehicleService } from '../../services/vehicleService';
import StatusBadge from '../../components/common/StatusBadge';
import { Crown, PlusCircle, Car, DollarSign, ToggleLeft, ToggleRight, Edit, Eye } from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOwnerFleet();
  }, [user]);

  const fetchOwnerFleet = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getOwnerVehicles(user.id);
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (v) => {
    const nextStatus = v.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await vehicleService.updateVehicleAvailability(v.id, nextStatus);
      addToast(`Updated ${v.name} status to ${nextStatus}`, 'success');
      fetchOwnerFleet();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const totalRevenue = vehicles.reduce((sum, v) => sum + (v.tripsCount || 0) * (v.dailyRate * 2), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Vehicle Owner Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage fleet inventory, rental availability, and earnings
          </p>
        </div>
        <Link to="/owner/add-vehicle" className="btn btn-success" style={{ gap: '8px' }}>
          <PlusCircle size={18} /> Register New Vehicle
        </Link>
      </div>

      {/* Metrics Header */}
      <div className="grid-cols-3" style={{ gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Fleet Size</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{vehicles.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Registered Vehicles</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Estimated Revenue</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>${totalRevenue}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Earned from completed bookings</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Fleet Status</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
            {vehicles.filter((v) => v.status === 'AVAILABLE').length} Available
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>Ready for customer reservations</div>
        </div>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Registered Fleet Vehicles</h3>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet...</div>
        ) : vehicles.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Car size={48} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
            <h4>No vehicles registered in your fleet</h4>
            <p style={{ color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>Add your first car or bike to start receiving rental requests.</p>
            <Link to="/owner/add-vehicle" className="btn btn-success">+ Add Vehicle</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Vehicle</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>License Plate</th>
                  <th style={{ padding: '12px' }}>Daily Rate</th>
                  <th style={{ padding: '12px' }}>Status Badge</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Availability Toggle</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={v.image} alt={v.name} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{v.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{v.location}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', color: 'var(--accent-primary)', fontWeight: 600 }}>{v.category}</td>
                    <td style={{ padding: '16px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{v.licensePlate}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 700, color: '#fff' }}>${v.dailyRate}/day</td>
                    <td style={{ padding: '16px 12px' }}><StatusBadge status={v.status} /></td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(v)}
                        disabled={v.status === 'BOOKED' || v.status === 'ACTIVE'}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', gap: '6px' }}
                      >
                        {v.status === 'AVAILABLE' ? (
                          <> <ToggleRight size={18} color="var(--accent-emerald)" /> Mark Unavailable </>
                        ) : (
                          <> <ToggleLeft size={18} color="var(--text-subtle)" /> Mark Available </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;

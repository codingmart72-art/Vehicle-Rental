import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { inspectionService } from '../../services/inspectionService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { Link } from 'react-router-dom';
import {
  Car, Eye, AlertTriangle, FileCheck, CheckCircle2
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pickupInsp, setPickupInsp] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings(user);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const handleViewInspection = async (booking) => {
    setSelectedBooking(booking);
    try {
      const insp = await inspectionService.getPickupInspection(booking.id);
      setPickupInsp(insp || null);
    } catch (_err) {
      setPickupInsp(null);
    }
    setInspectModalOpen(true);
  };

  const activeCount = bookings.filter((b) => b.status === 'BOOKED' || b.status === 'ACTIVE').length;
  const completedCount = bookings.filter((b) => b.status === 'RETURNED' || b.status === 'COMPLETED').length;
  const totalSpent = bookings.reduce((sum, b) => sum + (b.finalPrice || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Customer Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage active vehicle rentals, view inspection records, and track license status
        </p>
      </div>

      {/* License Security Notice Banner */}
      {user?.licenseStatus !== 'VERIFIED' && (
        <div className="glass-card" style={{
          padding: '20px',
          background: 'linear-gradient(90deg, rgba(245,158,11,0.15) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 700, color: '#fff' }}>Driving License Verification Required</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Your license status is <strong>{user?.licenseStatus || 'UNVERIFIED'}</strong>. Please upload document for Staff approval.
              </div>
            </div>
          </div>
          <Link to="/customer/license" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Upload License
          </Link>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid-cols-3" style={{ gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Rentals</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{activeCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Vehicles locked & reserved</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Completed Trips</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{completedCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Returned without issues</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Rental Spend</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>${totalSpent}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Processed via REST API</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Reservation History</h3>
          <Link to="/search" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
            + Book New Vehicle
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Car size={48} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
            <h4>No bookings recorded yet</h4>
            <p style={{ color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>Explore our fleet to reserve your first trip.</p>
            <Link to="/search" className="btn btn-primary">Browse Fleet</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Booking ID</th>
                  <th style={{ padding: '12px' }}>Vehicle</th>
                  <th style={{ padding: '12px' }}>Dates</th>
                  <th style={{ padding: '12px' }}>Final Amount</th>
                  <th style={{ padding: '12px' }}>Booking Status</th>
                  <th style={{ padding: '12px' }}>Payment</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--accent-primary)' }}>{b.id}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 600, color: '#fff' }}>{b.vehicleName}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{b.startDate} to {b.endDate}</td>
                    <td style={{ padding: '16px 12px', fontWeight: 700, color: '#fff' }}>${b.finalPrice}</td>
                    <td style={{ padding: '16px 12px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '16px 12px' }}><StatusBadge status={b.paymentStatus} /></td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleViewInspection(b)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} /> Rental Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Rental Details & Staff Pickup Inspection */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title={`Rental & Inspection Report #${selectedBooking?.id}`}
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Vehicle Model</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{selectedBooking.vehicleName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Pickup Location: {selectedBooking.pickupLocation}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Offer Code Applied: <strong>{selectedBooking.offerCode || 'None'}</strong></span>
              <span>Paid Amount: <strong style={{ color: 'var(--accent-emerald)' }}>${selectedBooking.finalPrice}</strong></span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="var(--accent-amber)" /> Staff Pickup Condition Record
              </h4>

              {pickupInsp ? (
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div>Inspected By Staff: <strong>{pickupInsp.staffName}</strong></div>
                  <div>Odometer Reading: <strong>{pickupInsp.odometer} km</strong></div>
                  <div>Fuel / Charge Level: <strong>{pickupInsp.fuelLevel}</strong></div>
                  <div>Pre-existing Damage Notes: <strong>{pickupInsp.existingScratches}</strong></div>
                  <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <CheckCircle2 size={15} /> Customer Condition Acknowledgement Verified
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  Staff pickup inspection is pending key release at station.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;

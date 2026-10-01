import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { licenseService } from '../../services/licenseService';
import { bookingService } from '../../services/bookingService';
import { inspectionService } from '../../services/inspectionService';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  FileCheck, Car, CheckCircle2, XCircle, Eye, Wrench, Camera
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('licenses');
  const [licenseQueue, setLicenseQueue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification & Inspection Modal States
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [staffNote, setStaffNote] = useState('');
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);

  // Pickup Inspection Form State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pickupOdometer, setPickupOdometer] = useState(14500);
  const [pickupFuel, setPickupFuel] = useState('100%');
  const [pickupScratches, setPickupScratches] = useState('No new scratches');
  const [pickupModalOpen, setPickupModalOpen] = useState(false);

  // Return Inspection Form State
  const [returnOdometer, setReturnOdometer] = useState(14800);
  const [returnFuel, setReturnFuel] = useState('90%');
  const [hasNewDamage, setHasNewDamage] = useState(false);
  const [newDamageNotes, setNewDamageNotes] = useState('');
  const [extraCharges, setExtraCharges] = useState(0);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const fetchStaffQueues = useCallback(async () => {
    setLoading(true);
    try {
      const lQueue = await licenseService.getLicenseVerificationQueue();
      setLicenseQueue(lQueue);
      const allB = await bookingService.getAllBookings();
      setBookings(allB);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffQueues();
  }, [fetchStaffQueues]);

  // License Approval/Rejection Handler
  const handleVerifyLicense = async (decision) => {
    if (!selectedLicense) return;
    try {
      await licenseService.verifyLicense(selectedLicense.id, decision, user, staffNote);
      addToast(`License ${selectedLicense.licenseNumber} marked as ${decision}`, 'success');
      setLicenseModalOpen(false);
      fetchStaffQueues();
    } catch (err) {
      addToast(err.message || 'Failed to verify license', 'error');
    }
  };

  // Submit Pickup Inspection Handler
  const handlePickupSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await inspectionService.submitPickupInspection({
        bookingId: selectedBooking.id,
        odometer: Number(pickupOdometer),
        fuelLevel: pickupFuel,
        existingScratches: pickupScratches,
        evidenceUrls: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'],
      }, user);

      addToast(`Pickup inspection approved for booking #${selectedBooking.id}! Keys released.`, 'success');
      setPickupModalOpen(false);
      fetchStaffQueues();
    } catch (err) {
      addToast(err.message || 'Inspection failed', 'error');
    }
  };

  // Submit Return Inspection Handler
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await inspectionService.submitReturnInspection({
        bookingId: selectedBooking.id,
        odometer: Number(returnOdometer),
        fuelLevel: returnFuel,
        hasNewDamage,
        newDamageNotes,
        additionalCharges: Number(extraCharges),
        evidenceUrls: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'],
      }, user);

      addToast(`Return inspection completed for booking #${selectedBooking.id}!`, 'success');
      setReturnModalOpen(false);
      fetchStaffQueues();
    } catch (err) {
      addToast(err.message || 'Return inspection failed', 'error');
    }
  };

  const pendingBookedForPickup = bookings.filter((b) => b.status === 'BOOKED');
  const activeRentalsForReturn = bookings.filter((b) => b.status === 'ACTIVE');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Staff Operations Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Conduct driving license verification, pickup inspections, and return inspections
        </p>
      </div>

      {/* Staff Queue Counters */}
      <div className="grid-cols-3" style={{ gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Pending License Queue</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{licenseQueue.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>Requires document verification</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Pickup Inspections Due</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{pendingBookedForPickup.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Vehicle condition check before key handoff</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Rentals / Returns</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{activeRentalsForReturn.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Ready for return inspection & damage review</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`btn ${activeTab === 'licenses' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FileCheck size={16} /> License Verification ({licenseQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('pickup')}
          className={`btn ${activeTab === 'pickup' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Car size={16} /> Pickup Inspections ({pendingBookedForPickup.length})
        </button>
        <button
          onClick={() => setActiveTab('return')}
          className={`btn ${activeTab === 'return' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Wrench size={16} /> Return Inspections ({activeRentalsForReturn.length})
        </button>
      </div>

      {/* TAB 1: License Verification Queue */}
      {activeTab === 'licenses' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Driving License Verification Queue</h3>
          {licenseQueue.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No pending license verification requests in queue.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>License Number</th>
                    <th style={{ padding: '12px' }}>State / Jurisdiction</th>
                    <th style={{ padding: '12px' }}>Expiry Date</th>
                    <th style={{ padding: '12px' }}>Submission Date</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {licenseQueue.map((lic) => (
                    <tr key={lic.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 700, color: '#fff' }}>{lic.userName} ({lic.userEmail})</td>
                      <td style={{ padding: '16px 12px', fontFamily: 'monospace' }}>{lic.licenseNumber}</td>
                      <td style={{ padding: '16px 12px' }}>{lic.issueState}</td>
                      <td style={{ padding: '16px 12px' }}>{lic.expiryDate}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{new Date(lic.submittedAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => { setSelectedLicense(lic); setLicenseModalOpen(true); }}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Eye size={14} /> Inspect & Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pickup Inspections Queue */}
      {activeTab === 'pickup' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Bookings Ready for Vehicle Pickup Inspection</h3>
          {pendingBookedForPickup.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No pickup inspections currently pending.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '12px' }}>Booking ID</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Vehicle</th>
                    <th style={{ padding: '12px' }}>Pickup Location</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookedForPickup.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--accent-primary)' }}>{b.id}</td>
                      <td style={{ padding: '16px 12px', fontWeight: 600, color: '#fff' }}>{b.customerName}</td>
                      <td style={{ padding: '16px 12px' }}>{b.vehicleName}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{b.pickupLocation}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => { setSelectedBooking(b); setPickupModalOpen(true); }}
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Camera size={14} /> Perform Pickup Inspection
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Return Inspections Queue */}
      {activeTab === 'return' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Active Rentals Due for Return Inspection</h3>
          {activeRentalsForReturn.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active vehicle rentals currently due for return.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '12px' }}>Booking ID</th>
                    <th style={{ padding: '12px' }}>Customer</th>
                    <th style={{ padding: '12px' }}>Vehicle</th>
                    <th style={{ padding: '12px' }}>Rental Status</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRentalsForReturn.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--accent-primary)' }}>{b.id}</td>
                      <td style={{ padding: '16px 12px', fontWeight: 600, color: '#fff' }}>{b.customerName}</td>
                      <td style={{ padding: '16px 12px' }}>{b.vehicleName}</td>
                      <td style={{ padding: '16px 12px' }}><StatusBadge status={b.status} /></td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => { setSelectedBooking(b); setReturnModalOpen(true); }}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Wrench size={14} /> Perform Return Inspection
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: License Verification Dialog */}
      <Modal isOpen={licenseModalOpen} onClose={() => setLicenseModalOpen(false)} title="Driving License Verification">
        {selectedLicense && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', height: '220px', border: '1px solid var(--border-color)' }}>
              <img src={selectedLicense.documentFrontUrl} alt="License document" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div className="glass-panel" style={{ padding: '14px', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div>Customer Name: <strong>{selectedLicense.userName}</strong></div>
              <div>License #: <strong>{selectedLicense.licenseNumber}</strong></div>
              <div>State / Expiry: <strong>{selectedLicense.issueState} (Expires {selectedLicense.expiryDate})</strong></div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Staff Review Notes</label>
              <input
                type="text"
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Document verified cleanly with state records..."
                className="glass-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button onClick={() => handleVerifyLicense('VERIFIED')} className="btn btn-success" style={{ flex: 1 }}>
                <CheckCircle2 size={16} /> Approve (VERIFIED)
              </button>
              <button onClick={() => handleVerifyLicense('REJECTED')} className="btn btn-danger" style={{ flex: 1 }}>
                <XCircle size={16} /> Reject License
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 2: Pickup Inspection Form */}
      <Modal isOpen={pickupModalOpen} onClose={() => setPickupModalOpen(false)} title="Perform Pickup Inspection">
        {selectedBooking && (
          <form onSubmit={handlePickupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
              Booking <strong>#{selectedBooking.id}</strong> — Vehicle: <strong>{selectedBooking.vehicleName}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Odometer Reading (km) *</label>
              <input type="number" value={pickupOdometer} onChange={(e) => setPickupOdometer(e.target.value)} className="glass-input" required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Fuel / Battery Level *</label>
              <input type="text" value={pickupFuel} onChange={(e) => setPickupFuel(e.target.value)} placeholder="100%" className="glass-input" required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Pre-existing Damage / Micro Scratches</label>
              <textarea value={pickupScratches} onChange={(e) => setPickupScratches(e.target.value)} className="glass-input" rows="2" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <input type="checkbox" defaultChecked required id="custAck" />
              <label htmlFor="custAck">Customer physical acknowledgement verified on-site</label>
            </div>

            <button type="submit" className="btn btn-success" style={{ padding: '0.8rem', marginTop: '8px' }}>
              Approve Pickup & Release Vehicle Keys
            </button>
          </form>
        )}
      </Modal>

      {/* Modal 3: Return Inspection Form */}
      <Modal isOpen={returnModalOpen} onClose={() => setReturnModalOpen(false)} title="Perform Return Inspection">
        {selectedBooking && (
          <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
              Rental <strong>#{selectedBooking.id}</strong> — Customer: <strong>{selectedBooking.customerName}</strong>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Return Odometer Reading (km) *</label>
              <input type="number" value={returnOdometer} onChange={(e) => setReturnOdometer(e.target.value)} className="glass-input" required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Return Fuel / Battery Level *</label>
              <input type="text" value={returnFuel} onChange={(e) => setReturnFuel(e.target.value)} className="glass-input" required />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                <input type="checkbox" checked={hasNewDamage} onChange={(e) => setHasNewDamage(e.target.checked)} />
                Flag New Damage / Scratches Detected
              </label>
            </div>

            {hasNewDamage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Damage Description</label>
                  <textarea value={newDamageNotes} onChange={(e) => setNewDamageNotes(e.target.value)} placeholder="Deep scratch on right door panel..." className="glass-input" rows="2" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Additional Repair Fee ($)</label>
                  <input type="number" value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} className="glass-input" />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '8px' }}>
              Submit Return Inspection & Complete Rental
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StaffDashboard;

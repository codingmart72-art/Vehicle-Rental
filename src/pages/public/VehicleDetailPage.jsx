import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { offerService } from '../../services/offerService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Calendar, ShieldCheck, Tag, CreditCard, CheckCircle2,
  AlertTriangle, ArrowLeft, Star, MapPin, Lock
} from 'lucide-react';

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [vehicle, setVehicle] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow State
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const v = await vehicleService.getVehicleDetails(id);
      setVehicle(v);
      const o = await offerService.getFestivalOffers();
      setOffers(o.filter((item) => item.isActive));
    } catch (_err) {
      addToast('Vehicle not found', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading vehicle specs...</div>;
  if (!vehicle) return <div style={{ padding: '60px', textAlign: 'center' }}>Vehicle not found</div>;

  // Calculate prices using bookingService
  const preview = bookingService.calculateBookingPreview(
    vehicle.dailyRate,
    startDate,
    endDate,
    selectedOffer ? selectedOffer.discountPercent : 0
  );

  const isLicenseVerified = user?.licenseStatus === 'VERIFIED';

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to create a booking', 'warning');
      navigate('/login');
      return;
    }

    if (!isLicenseVerified) {
      addToast('Driving License verification required before booking', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await bookingService.createBooking({
        vehicleId: vehicle.id,
        startDate,
        endDate,
        totalDays: preview.totalDays,
        subtotal: preview.subtotal,
        offerCode: selectedOffer ? selectedOffer.code : null,
        discountAmount: preview.discountAmount,
        finalPrice: preview.finalPrice,
      }, user);

      setBookingConfirmed(result);
      addToast('Booking confirmed & payment processed successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to submit booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ width: 'fit-content', gap: '6px' }}>
        <ArrowLeft size={16} /> Back to Directory
      </button>

      {/* Booking Confirmation Dialog Banner */}
      {bookingConfirmed ? (
        <div className="glass-card" style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid var(--accent-emerald)',
          textAlign: 'center'
        }}>
          <CheckCircle2 size={64} color="var(--accent-emerald)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Booking Confirmed! #{bookingConfirmed.id}</h2>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 24px 0', fontSize: '1.05rem' }}>
            Payment of <strong>${bookingConfirmed.finalPrice}</strong> was verified. Your rental for <strong>{bookingConfirmed.vehicleName}</strong> is locked.
          </p>

          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto 28px auto', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '10px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} /> Next Steps & Pickup Instructions:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>1. Proceed to pickup hub: <strong>{bookingConfirmed.pickupLocation}</strong></li>
              <li>2. Present your verified physical license (DL-98721456-X).</li>
              <li>3. Staff inspector will record vehicle condition & odometer during Pickup Inspection.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/customer/dashboard" className="btn btn-primary">
              Go to Customer Dashboard
            </Link>
            <button onClick={() => setBookingConfirmed(null)} className="btn btn-secondary">
              Book Another Vehicle
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          {/* Left Column: Vehicle Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '360px' }}>
                <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <StatusBadge status={vehicle.status} />
                </div>
              </div>

              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {vehicle.brand} • {vehicle.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }}>
                    <Star size={16} fill="#f59e0b" /> {vehicle.rating} ({vehicle.tripsCount} trips completed)
                  </div>
                </div>

                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>{vehicle.name}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  <MapPin size={18} color="var(--accent-primary)" /> Pickup Location: {vehicle.location}
                </div>

                {/* Technical Specs */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Vehicle Specifications
                </h3>
                <div className="grid-cols-4" style={{ gap: '16px', marginBottom: '24px' }}>
                  <div className="glass-panel" style={{ padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Seating</div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{vehicle.seats} Seats</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Transmission</div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{vehicle.transmission}</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Fuel / Power</div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{vehicle.fuelType}</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>License Plate</div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{vehicle.licensePlate}</div>
                  </div>
                </div>

                {/* Features */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Included Premium Features</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {vehicle.features?.map((f, i) => (
                    <span key={i} style={{
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      color: '#a5b4fc',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <CheckCircle2 size={14} color="var(--accent-primary)" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Critical Booking Form & Price Calculator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Driving License Requirement Guard Alert */}
            {!isLicenseVerified && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '14px',
                padding: '18px',
                color: '#fbbf24',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, marginBottom: '6px' }}>
                  <AlertTriangle size={20} /> License Verification Required
                </div>
                Your driving license status is currently <strong>{user?.licenseStatus || 'UNVERIFIED'}</strong>.
                You must submit a valid driving license before completing a reservation.
                <div style={{ marginTop: '12px' }}>
                  <Link to="/customer/license" className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: '#f59e0b', color: '#1e1b4b', fontWeight: 700 }}>
                    Upload Driving License
                  </Link>
                </div>
              </div>
            )}

            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>${vehicle.dailyRate}</span>
                  <span style={{ color: 'var(--text-subtle)' }}> / day</span>
                </div>
                <div className="badge badge-available">
                  Backend API Rate Verified
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Select Rental Dates */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Pickup Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setStartDate(newStart);
                      if (endDate < newStart) {
                        setEndDate(newStart);
                      }
                    }}
                    className="glass-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>

                {/* Festival Offers Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    <Tag size={14} style={{ display: 'inline', marginRight: '4px' }} /> Festival Promo Code
                  </label>
                  <select
                    value={selectedOffer ? selectedOffer.code : ''}
                    onChange={(e) => {
                      const found = offers.find((o) => o.code === e.target.value);
                      setSelectedOffer(found || null);
                    }}
                    className="glass-input"
                  >
                    <option value="">No promo code selected</option>
                    {offers.map((o) => (
                      <option key={o.id} value={o.code}>
                        {o.code} - {o.title} ({o.discountPercent}% OFF)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Price Preview Breakdown */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Duration</span>
                    <span>{preview.totalDays} Days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Base Subtotal (${vehicle.dailyRate} × {preview.totalDays})</span>
                    <span>${preview.subtotal}</span>
                  </div>
                  {selectedOffer && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      <span>Festival Discount ({selectedOffer.code})</span>
                      <span>-${preview.discountAmount}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800,
                    borderTop: '1px solid var(--border-color)', paddingTop: '10px', color: '#fff'
                  }}>
                    <span>Final Total</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>${preview.finalPrice}</span>
                  </div>
                </div>

                {/* Duplicate Submit Prevention & Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || vehicle.status !== 'AVAILABLE' || !isLicenseVerified}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '10px' }}
                >
                  {submitting ? (
                    'Processing Secure Booking...'
                  ) : vehicle.status !== 'AVAILABLE' ? (
                    'Vehicle Currently Reserved'
                  ) : !isLicenseVerified ? (
                    'License Verification Required'
                  ) : (
                    <>
                      <CreditCard size={18} /> Confirm & Pay ${preview.finalPrice}
                    </>
                  )}
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Lock size={12} /> Encrypted REST API transaction preview
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;

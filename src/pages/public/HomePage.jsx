import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import { offerService } from '../../services/offerService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Search, Tag, ArrowRight, Sparkles, Star, MapPin
} from 'lucide-react';

export const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [offers, setOffers] = useState([]);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    vehicleService.searchVehicles().then((data) => setVehicles(data.slice(0, 4)));
    offerService.getFestivalOffers().then((data) => setOffers(data));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?search=${encodeURIComponent(searchTerm)}&category=${searchCategory}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Hero Section */}
      <div className="glass-card" style={{
        padding: '56px 40px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.85) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Glow circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px',
          background: 'rgba(99, 102, 241, 0.25)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-50px', width: '300px', height: '300px',
          background: 'rgba(16, 185, 129, 0.2)', filter: 'blur(100px)', borderRadius: '50%'
        }} />

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div className="badge badge-active" style={{ marginBottom: '16px', gap: '6px' }}>
            <Sparkles size={14} /> Production-Style Vehicle Rental Platform
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
            Drive the Future with <span style={{
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Verified Mobility</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '640px' }}>
            Reserve luxury cars, EVs, SUVs, and high-performance bikes with instant license verification, transparent pricing, and digital staff inspection.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
              <Search size={18} color="var(--accent-primary)" />
              <input
                type="text"
                placeholder="Search brand, model (e.g. Tesla, BMW, Ducati)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input"
                style={{ border: 'none', background: 'transparent' }}
              />
            </div>

            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="glass-input"
              style={{ width: '160px' }}
            >
              <option value="All">All Categories</option>
              <option value="Electric">Electric</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Superbike">Superbike</option>
              <option value="Scooter">Scooter</option>
            </select>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              Search Fleet <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Live Festival Offer Banner */}
      {offers.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(236,72,153,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
              <Tag size={28} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{offers[0].title}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Use code <strong>{offers[0].code}</strong> at checkout for {offers[0].discountPercent}% off!</p>
            </div>
          </div>
          <Link to="/offers" className="btn" style={{ background: '#ffffff', color: '#1e1b4b', fontWeight: 700 }}>
            Claim Offer
          </Link>
        </div>
      )}

      {/* Featured Fleet */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Fleet</h2>
            <p style={{ color: 'var(--text-muted)' }}>Verified vehicles ready for instant booking</p>
          </div>
          <Link to="/search" className="btn btn-secondary">
            View All Fleet <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cols-4" style={{ gap: '24px' }}>
          {vehicles.map((v) => (
            <div key={v.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={v.image}
                  alt={v.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <StatusBadge status={v.status} />
                </div>
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                  padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#fff',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" /> {v.rating} ({v.tripsCount} trips)
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {v.category} • {v.transmission}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '6px 0 12px 0', color: '#fff' }}>
                  {v.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <MapPin size={14} /> {v.location}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>${v.dailyRate}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}> / day</span>
                  </div>
                  <Link to={`/vehicle/${v.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View & Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Booking UI Flow Summary */}
      <div className="glass-card" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
          Seamless & Secure Booking Workflow
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Strict security checks protect customers, fleet owners, and staff at every step
        </p>

        <div className="grid-cols-4" style={{ gap: '20px' }}>
          {[
            { step: '1', title: 'License Verification', desc: 'Customer uploads driving license for Staff review.' },
            { step: '2', title: 'Availability & Offer', desc: 'Select dates & apply eligible festival promo codes.' },
            { step: '3', title: 'Payment & Confirm', desc: 'Secure payment generates instant booking status.' },
            { step: '4', title: 'Pickup Inspection', desc: 'Staff inspects odometer, condition, & evidence before key handoff.' }
          ].map((s) => (
            <div key={s.step} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              padding: '24px',
              borderRadius: '12px',
              position: 'relative'
            }}>
              <div style={{
                background: 'var(--accent-primary)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                marginBottom: '14px'
              }}>
                {s.step}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{s.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

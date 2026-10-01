import React, { useState, useEffect } from 'react';
import { offerService } from '../../services/offerService';
import { useNotification } from '../../context/NotificationContext';
import { Tag, Sparkles, Calendar, CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FestivalOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    offerService.getFestivalOffers().then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    addToast(`Promo code ${code} copied to clipboard!`, 'success');
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading festival offers...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-active" style={{ marginBottom: '12px', gap: '6px' }}>
          <Sparkles size={14} /> Season Exclusive Discounts
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Festival Special Offers</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Claim instant promotional codes to save up to 25% on your vehicle rentals across all categories.
        </p>
      </div>

      <div className="grid-cols-3" style={{ gap: '24px' }}>
        {offers.map((o) => (
          <div key={o.id} className="glass-card" style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            border: '1px solid rgba(168,85,247,0.3)',
            background: 'linear-gradient(180deg, rgba(168,85,247,0.08) 0%, rgba(15,23,42,0.95) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="badge badge-verified">{o.discountPercent}% DISCOUNT</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> Valid until {o.validUntil}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{o.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{o.description}</p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px dashed var(--accent-primary)',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>PROMO CODE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                  {o.code}
                </div>
              </div>
              <button
                onClick={() => copyCode(o.code)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Min {o.minDays} rental day(s)</span>
              <button onClick={() => navigate('/search')} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Use Code Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalOffersPage;

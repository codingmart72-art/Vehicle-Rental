import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import StatusBadge from '../../components/common/StatusBadge';
import { Search, Filter, SlidersHorizontal, Star, ArrowRight } from 'lucide-react';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [transmission, setTransmission] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleService.searchVehicles({
        search,
        category,
        transmission,
        maxPrice,
      });
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  }, [search, category, transmission, maxPrice]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Fleet Directory</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse available cars, SUVs, and bikes with verified backend pricing</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Filters Sidebar */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <SlidersHorizontal size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filter Vehicles</h3>
          </div>

          {/* Search text */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Search Keyword</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Model, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Vehicle Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input">
              <option value="All">All Categories</option>
              <option value="Electric">Electric</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Superbike">Superbike</option>
              <option value="Scooter">Scooter</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Transmission</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="glass-input">
              <option value="All">All Types</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>Max Rate</span>
              <span style={{ color: 'var(--accent-primary)' }}>${maxPrice} / day</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>

          <button
            onClick={() => { setSearch(''); setCategory('All'); setTransmission('All'); setMaxPrice(250); }}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', marginTop: '10px' }}
          >
            Reset Filters
          </button>
        </div>

        {/* Vehicles Grid */}
        <div>
          {loading ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading vehicle directory...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <h3>No matching vehicles found</h3>
              <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px 0' }}>Try adjusting your filters or price range.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setMaxPrice(250); }} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-cols-3" style={{ gap: '20px' }}>
              {vehicles.map((v) => (
                <div key={v.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '170px' }}>
                    <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <StatusBadge status={v.status} />
                    </div>
                  </div>

                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {v.brand} • {v.category}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 8px 0', color: '#fff' }}>
                      {v.name}
                    </h4>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                        {v.seats} Seats
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                        {v.fuelType}
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                        {v.rangeKm} km range
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${v.dailyRate}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>/day</span>
                      </div>
                      <Link to={`/vehicle/${v.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                        Book Now <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

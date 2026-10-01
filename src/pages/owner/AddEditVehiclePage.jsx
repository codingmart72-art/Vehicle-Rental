import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { vehicleService } from '../../services/vehicleService';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export const AddEditVehiclePage = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electric',
    type: 'Car',
    brand: '',
    model: '',
    year: 2024,
    licensePlate: '',
    dailyRate: 100,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    rangeKm: 500,
    location: 'Downtown Hub - Terminal 1',
    features: 'Autopilot, Leather Seats, GPS',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.licensePlate || !formData.dailyRate) {
      addToast('Please complete all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const featArray = typeof formData.features === 'string'
        ? formData.features.split(',').map((f) => f.trim())
        : formData.features;

      await vehicleService.createVehicle({
        ...formData,
        dailyRate: Number(formData.dailyRate),
        year: Number(formData.year),
        seats: Number(formData.seats),
        rangeKm: Number(formData.rangeKm),
        features: featArray,
      }, user);

      addToast(`Vehicle ${formData.name} added to your fleet successfully!`, 'success');
      navigate('/owner/dashboard');
    } catch (err) {
      addToast(err.message || 'Failed to add vehicle', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Fleet Hub
      </button>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <PlusCircle size={28} color="var(--accent-emerald)" />
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Register New Fleet Vehicle</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add a car or bike to earn rental revenue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-cols-2" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Vehicle Title *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Audi RS e-tron GT"
                className="glass-input"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="glass-input">
                <option value="Electric">Electric</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Superbike">Superbike</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>
          </div>

          <div className="grid-cols-3" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Brand *</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Audi" className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Model</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e-tron" className="glass-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="glass-input" />
            </div>
          </div>

          <div className="grid-cols-3" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>License Plate *</label>
              <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="EV-990-AU" className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Daily Rate ($/day) *</label>
              <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} className="glass-input" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Seating Capacity</label>
              <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="glass-input" />
            </div>
          </div>

          <div className="grid-cols-3" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="glass-input">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Fuel / Power Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="glass-input">
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Station Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="glass-input" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Features (comma separated)</label>
            <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="Panoramic Roof, AWD, Sport Mode" className="glass-input" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Vehicle Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="glass-input" />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-success"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '10px' }}
          >
            {submitting ? 'Registering Fleet Vehicle...' : 'Save & Publish Fleet Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditVehiclePage;

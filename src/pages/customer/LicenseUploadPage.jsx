import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { licenseService } from '../../services/licenseService';
import StatusBadge from '../../components/common/StatusBadge';
import { Upload } from 'lucide-react';

export const LicenseUploadPage = () => {
  const { user, setUser } = useAuth();
  const { addToast } = useNotification();

  const [licenseNumber, setLicenseNumber] = useState('DL-98721456-X');
  const [expiryDate, setExpiryDate] = useState('2029-08-14');
  const [issueState, setIssueState] = useState('California');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80');
  const [submitting, setSubmitting] = useState(false);
  const [currentLicenseRecord, setCurrentLicenseRecord] = useState(null);

  useEffect(() => {
    if (user) {
      licenseService.getAllLicenses().then((list) => {
        const found = list.find((l) => l.userId === user.id || l.userEmail === user.email);
        if (found) {
          setCurrentLicenseRecord(found);
          setLicenseNumber(found.licenseNumber);
          setExpiryDate(found.expiryDate);
          setIssueState(found.issueState);
          if (found.documentFrontUrl) setPreviewUrl(found.documentFrontUrl);
        }
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation: File type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      addToast('Invalid file format. Please upload JPG, PNG, WEBP, or PDF.', 'error');
      return;
    }

    // Validation: Size (Max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      addToast('File size exceeds 5MB limit.', 'error');
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
    addToast('Document selected & validated cleanly', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!licenseNumber || !expiryDate || !issueState) {
      addToast('Please complete all license fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const record = await licenseService.uploadDrivingLicense(user.id, {
        licenseNumber,
        expiryDate,
        issueState,
        documentFrontUrl: previewUrl,
      });

      setCurrentLicenseRecord(record);
      // Update local user context status to PENDING
      setUser({ ...user, licenseStatus: 'PENDING' });
      addToast('Driving License submitted! Staff will verify your document shortly.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to upload license', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Driving License Verification</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Mandatory security compliance step before reserving vehicles on VelocityRent.
        </p>
      </div>

      {/* Current License Verification Status Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Verification Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <StatusBadge status={user?.licenseStatus || 'UNVERIFIED'} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              License #: <strong>{licenseNumber || 'N/A'}</strong>
            </span>
          </div>
        </div>

        {currentLicenseRecord?.notes && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-subtle)' }}>Staff Inspector Note: </span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{currentLicenseRecord.notes}</span>
          </div>
        )}
      </div>

      {/* Document Upload Form */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          Document Details & Evidence Upload
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-cols-3" style={{ gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>License Number *</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="DL-98721456-X"
                className="glass-input"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Expiry Date *</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="glass-input"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Issuing State / Jurisdiction *</label>
              <input
                type="text"
                value={issueState}
                onChange={(e) => setIssueState(e.target.value)}
                placeholder="California"
                className="glass-input"
                required
              />
            </div>
          </div>

          {/* File Upload Zone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Upload Front Side Photo / PDF (Max 5MB) *
            </label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.5)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <Upload size={36} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                {file ? file.name : 'Click or Drag & Drop license file to upload'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                Supported formats: JPG, PNG, WEBP, PDF (Validated securely)
              </div>
            </div>
          </div>

          {/* Preview Image */}
          {previewUrl && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Document Document Preview</label>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid var(--border-color)', maxWidth: '400px' }}>
                <img src={previewUrl} alt="License document preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '10px' }}
          >
            {submitting ? 'Uploading to Verification Queue...' : 'Submit License for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LicenseUploadPage;

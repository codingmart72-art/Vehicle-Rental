import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <Compass size={64} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>404 — Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px 0' }}>
        The route you requested does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;

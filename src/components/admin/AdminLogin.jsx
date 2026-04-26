import React, { useState } from 'react';
import useAdminAuthStore from '../../store/adminAuthStore';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminAuthStore((s) => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay to feel intentional
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">AB Furniture</div>
        <p className="admin-login-subtitle">Admin Panel — Enter your password to continue</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              type="password"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="admin-form-error">{error}</p>}
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading || !password}
            style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px' }}>
          Authorized personnel only. Contact your agency for access.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;

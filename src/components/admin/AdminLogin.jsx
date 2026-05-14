import React, { useState } from 'react';
import useAdminAuthStore from '../../store/adminAuthStore';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">AB Furniture</div>
        <p className="admin-login-subtitle">Admin Panel — Sign in to continue</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input
              type="email"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abfurniture.com"
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input
              type="password"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {error && <p className="admin-form-error">{error}</p>}
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading || !email || !password}
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

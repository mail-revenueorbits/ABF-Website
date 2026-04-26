import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import AdminToast from './AdminToast';
import useAdminAuthStore from '../../store/adminAuthStore';
import './admin.css';

function AdminLayout() {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Derive page title from the current route
  const pathSegment = location.pathname.split('/').pop();
  const pageTitles = {
    admin: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    banners: 'Banners & Promotions',
    blog: 'Blog',
    inquiries: 'Inquiries',
    analytics: 'Analytics',
  };
  const currentTitle = pageTitles[pathSegment] || 'Dashboard';

  return (
    <div className="admin-wrapper">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--walnut)' }}>
              {currentTitle}
            </span>
          </div>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              AB Furniture Admin
            </span>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <AdminToast />
    </div>
  );
}

export default AdminLayout;

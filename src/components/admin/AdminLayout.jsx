import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import AdminToast from './AdminToast';
import useAdminAuthStore from '../../store/adminAuthStore';
import useProductStore from '../../store/productStore';
import useCategoryStore from '../../store/categoryStore';
import useBannerStore from '../../store/bannerStore';
import useBlogStore from '../../store/blogStore';
import useInquiryStore from '../../store/inquiryStore';
import './admin.css';

function AdminLayout() {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const initAuth = useAdminAuthStore((s) => s.initAuth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  // Initialize auth session on mount
  useEffect(() => {
    initAuth().then(() => setAuthChecked(true));
  }, [initAuth]);

  // Fetch all admin data once authenticated
  const fetchAllProducts = useProductStore((s) => s.fetchAllProducts);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const fetchBanners = useBannerStore((s) => s.fetchBanners);
  const fetchPosts = useBlogStore((s) => s.fetchPosts);
  const fetchInquiries = useInquiryStore((s) => s.fetchInquiries);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllProducts();
      fetchCategories();
      fetchBanners();
      fetchPosts();
      fetchInquiries();
    }
  }, [isAuthenticated, fetchAllProducts, fetchCategories, fetchBanners, fetchPosts, fetchInquiries]);

  // Show nothing until auth state is checked
  if (!authChecked) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}>
        Checking authentication...
      </div>
    );
  }

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

import React from 'react';
import { NavLink } from 'react-router-dom';
import useInquiryStore from '../../store/inquiryStore';
import useAdminAuthStore from '../../store/adminAuthStore';

function AdminSidebar({ isOpen, onClose }) {
  const newInquiries = useInquiryStore((s) => s.getNewCount());
  const logout = useAdminAuthStore((s) => s.logout);

  const navItems = [
    { to: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
    { to: '/admin/products', icon: 'inventory_2', label: 'Products' },
    { to: '/admin/categories', icon: 'category', label: 'Categories' },
    { to: '/admin/banners', icon: 'featured_play_list', label: 'Banners & Promos' },
    { section: 'Content' },
    { to: '/admin/blog', icon: 'article', label: 'Blog' },
    { to: '/admin/inquiries', icon: 'mail', label: 'Inquiries', badge: newInquiries > 0 ? newInquiries : null },
    { section: 'Insights' },
    { to: '/admin/analytics', icon: 'bar_chart', label: 'Analytics' },
  ];

  return (
    <>
      <div
        className={`admin-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin" className="admin-sidebar-brand" onClick={onClose}>
            AB Furniture
          </NavLink>
          <div className="admin-sidebar-subtitle">Admin Panel</div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="admin-sidebar-section">{item.section}</div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link" target="_blank" style={{ fontSize: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
            <span>View Website</span>
          </NavLink>
          <button
            onClick={logout}
            className="admin-nav-link"
            style={{ width: '100%', fontSize: '12px', color: '#C53030' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;

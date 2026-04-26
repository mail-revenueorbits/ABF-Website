import React from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useInquiryStore from '../../store/inquiryStore';
import useBlogStore from '../../store/blogStore';
import useBannerStore from '../../store/bannerStore';
import { formatNPR } from '../../utils/formatCurrency';

function Dashboard() {
  const products = useProductStore((s) => s.products);
  const inquiries = useInquiryStore((s) => s.inquiries);
  const newInquiries = useInquiryStore((s) => s.getNewCount());
  const posts = useBlogStore((s) => s.posts);
  const banners = useBannerStore((s) => s.banners);

  const publishedProducts = products.filter((p) => p.published);
  const onSaleProducts = products.filter((p) => p.onSale);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  // Recent inquiries (last 5)
  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent products (last 5)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back. Here is your business overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products" className="admin-btn admin-btn-secondary admin-btn-sm">
            <span className="material-symbols-outlined">inventory_2</span>
            Manage Products
          </Link>
          <Link to="/admin/inquiries" className="admin-btn admin-btn-primary admin-btn-sm">
            <span className="material-symbols-outlined">mail</span>
            View Inquiries {newInquiries > 0 && `(${newInquiries})`}
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">Total Products</span>
          <span className="admin-metric-value">{products.length}</span>
          <span className="admin-metric-change neutral">
            {publishedProducts.length} published
          </span>
        </div>

        <div className="admin-metric-card">
          <span className="admin-metric-label">On Sale</span>
          <span className="admin-metric-value">{onSaleProducts.length}</span>
          <span className="admin-metric-change positive">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_offer</span>
            Active promotions
          </span>
        </div>

        <div className="admin-metric-card">
          <span className="admin-metric-label">New Inquiries</span>
          <span className="admin-metric-value">{newInquiries}</span>
          <span className="admin-metric-change" style={{ color: newInquiries > 0 ? '#E8501A' : 'var(--text-muted)' }}>
            {newInquiries > 0 ? 'Needs attention' : 'All caught up'}
          </span>
        </div>

        <div className="admin-metric-card">
          <span className="admin-metric-label">Catalog Value</span>
          <span className="admin-metric-value" style={{ fontSize: '22px' }}>{formatNPR(totalInventoryValue)}</span>
          <span className="admin-metric-change neutral">
            Across {products.length} items
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Quick Actions</h3>
          </div>
          <div className="admin-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link to="/admin/products?action=new" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ justifyContent: 'flex-start' }}>
              <span className="material-symbols-outlined">add_circle</span>
              Add Product
            </Link>
            <Link to="/admin/banners" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ justifyContent: 'flex-start' }}>
              <span className="material-symbols-outlined">campaign</span>
              Add Banner
            </Link>
            <Link to="/admin/blog?action=new" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ justifyContent: 'flex-start' }}>
              <span className="material-symbols-outlined">edit_note</span>
              Write Blog Post
            </Link>
            <Link to="/admin/categories" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ justifyContent: 'flex-start' }}>
              <span className="material-symbols-outlined">tune</span>
              Manage Categories
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
          </div>
          <div className="admin-card-body" style={{ padding: '8px 24px' }}>
            {recentInquiries.length === 0 ? (
              <div className="admin-empty" style={{ padding: '32px' }}>
                <span className="material-symbols-outlined">inbox</span>
                <p>No inquiries yet</p>
              </div>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="admin-activity-item">
                  <div className="admin-activity-icon" style={{
                    background: inq.status === 'new' ? 'rgba(232,80,26,0.1)' : inq.status === 'replied' ? 'rgba(42,124,111,0.1)' : 'rgba(112,74,46,0.06)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: inq.status === 'new' ? '#E8501A' : inq.status === 'replied' ? '#2A7C6F' : 'var(--text-muted)'
                    }}>
                      {inq.status === 'new' ? 'mark_email_unread' : inq.status === 'replied' ? 'reply' : 'check_circle'}
                    </span>
                  </div>
                  <div className="admin-activity-text">
                    <p><strong>{inq.name}</strong> — {inq.productOfInterest}</p>
                    <span>{new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recently Updated Products */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recently Updated Products</h3>
          <Link to="/admin/products" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="admin-table-img" />
                    ) : (
                      <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>image</span>
                      </div>
                    )}
                    <span style={{ fontWeight: '500', color: 'var(--walnut-dark)' }}>{p.name}</span>
                  </td>
                  <td>
                    {p.onSale ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px' }}>{formatNPR(p.price)}</span>
                        <br />
                        <span style={{ color: '#C53030', fontWeight: '600' }}>{formatNPR(p.salePrice)}</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: '500' }}>{formatNPR(p.price)}</span>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${p.published ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${p.stockStatus === 'in_stock' ? 'admin-badge-success' : p.stockStatus === 'made_to_order' ? 'admin-badge-info' : 'admin-badge-danger'}`}>
                      {p.stockStatus === 'in_stock' ? 'In Stock' : p.stockStatus === 'made_to_order' ? 'Made to Order' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Blog Posts</span>
          <span className="admin-metric-value">{posts.length}</span>
          <span className="admin-metric-change neutral">{posts.filter(p => p.published).length} published</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Active Banners</span>
          <span className="admin-metric-value">{banners.filter(b => b.active).length}</span>
          <span className="admin-metric-change neutral">{banners.length} total</span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Total Inquiries</span>
          <span className="admin-metric-value">{inquiries.length}</span>
          <span className="admin-metric-change neutral">{inquiries.filter(i => i.status === 'closed').length} resolved</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

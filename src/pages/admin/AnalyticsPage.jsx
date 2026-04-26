import React, { useState } from 'react';
import useProductStore from '../../store/productStore';
import useInquiryStore from '../../store/inquiryStore';
import useCategoryStore from '../../store/categoryStore';

/**
 * Analytics Dashboard with mock data visualization.
 * Prepared for GA4 integration — replace mock data with real API calls.
 */

// Mock data for visualization
const MOCK_WEEKLY_VIEWS = [
  { day: 'Mon', views: 142 },
  { day: 'Tue', views: 189 },
  { day: 'Wed', views: 165 },
  { day: 'Thu', views: 258 },
  { day: 'Fri', views: 132 },
  { day: 'Sat', views: 310 },
  { day: 'Sun', views: 287 },
];

const MOCK_TOP_PAGES = [
  { page: '/shop', views: 1240, label: 'Shop' },
  { page: '/', views: 980, label: 'Homepage' },
  { page: '/product/royal-sofa-set', views: 456, label: 'Royal Sofa Set' },
  { page: '/product/marble-top-dining', views: 389, label: 'Marble Top Dining' },
  { page: '/shop?category=office-chairs', views: 312, label: 'Office Chairs' },
];

const MOCK_TRAFFIC_SOURCES = [
  { source: 'Meta Ads', percent: 45, color: '#1877F2' },
  { source: 'Direct', percent: 25, color: 'var(--walnut)' },
  { source: 'Google Search', percent: 18, color: '#34A853' },
  { source: 'WhatsApp', percent: 8, color: '#25D366' },
  { source: 'Other', percent: 4, color: 'var(--text-muted)' },
];

function AnalyticsPage() {
  const products = useProductStore((s) => s.products);
  const inquiries = useInquiryStore((s) => s.inquiries);
  const categories = useCategoryStore((s) => s.categories);
  const [period, setPeriod] = useState('7d');

  const maxViews = Math.max(...MOCK_WEEKLY_VIEWS.map((d) => d.views));
  const totalWeeklyViews = MOCK_WEEKLY_VIEWS.reduce((s, d) => s + d.views, 0);

  // Category breakdown
  const categoryBreakdown = categories
    .map((cat) => ({
      ...cat,
      count: products.filter((p) => p.categoryId === cat.id).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">Website performance and traffic overview</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              className={`admin-btn admin-btn-sm ${period === p ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setPeriod(p)}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(42,124,111,0.06)',
        border: '1px solid rgba(42,124,111,0.15)',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--teal)' }}>info</span>
        <span style={{ fontSize: '13px', color: 'var(--teal)' }}>
          Currently showing mock data. Connect Google Analytics 4 to see live metrics.
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <span className="admin-metric-label">Page Views</span>
          <span className="admin-metric-value">{totalWeeklyViews.toLocaleString()}</span>
          <span className="admin-metric-change positive">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
            +18.3% vs prev. week
          </span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">WhatsApp Clicks</span>
          <span className="admin-metric-value">87</span>
          <span className="admin-metric-change positive">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
            +12.5%
          </span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Contact Forms</span>
          <span className="admin-metric-value">{inquiries.length}</span>
          <span className="admin-metric-change neutral">
            From website forms
          </span>
        </div>
        <div className="admin-metric-card">
          <span className="admin-metric-label">Avg. Session</span>
          <span className="admin-metric-value">3:24</span>
          <span className="admin-metric-change positive">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
            +8.1%
          </span>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Bar Chart — Weekly Views */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Page Views (This Week)</h3>
          </div>
          <div className="admin-card-body">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '16px',
              height: '200px',
              paddingBottom: '8px',
            }}>
              {MOCK_WEEKLY_VIEWS.map((d, i) => {
                const height = (d.views / maxViews) * 100;
                const isMax = d.views === maxViews;
                return (
                  <div
                    key={d.day}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: '600', color: isMax ? 'var(--walnut)' : 'var(--text-muted)' }}>
                      {d.views}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '48px',
                        height: `${height}%`,
                        background: isMax ? 'var(--walnut)' : 'rgba(112,74,46,0.12)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.5s ease',
                        minHeight: '4px',
                      }}
                    />
                    <span style={{
                      fontSize: '11px',
                      fontWeight: isMax ? '700' : '500',
                      color: isMax ? 'var(--walnut)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Traffic Sources</h3>
          </div>
          <div className="admin-card-body">
            {MOCK_TRAFFIC_SOURCES.map((src) => (
              <div key={src.source} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{src.source}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--walnut-dark)' }}>{src.percent}%</span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(112,74,46,0.06)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${src.percent}%`,
                    background: src.color,
                    borderRadius: '3px',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Pages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Top Pages</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TOP_PAGES.map((p) => (
                  <tr key={p.page}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '13px', color: 'var(--walnut-dark)' }}>{p.label}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.page}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', fontSize: '13px' }}>{p.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Category Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Products by Category</h3>
          </div>
          <div className="admin-card-body">
            {categoryBreakdown.length === 0 ? (
              <div className="admin-empty" style={{ padding: '24px' }}>
                <p>No products categorized yet.</p>
              </div>
            ) : (
              categoryBreakdown.map((cat) => {
                const maxCount = categoryBreakdown[0].count;
                return (
                  <div key={cat.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{cat.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--walnut-dark)' }}>{cat.count}</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'rgba(112,74,46,0.06)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(cat.count / maxCount) * 100}%`,
                        background: 'var(--walnut)',
                        borderRadius: '3px',
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Meta Pixel / Conversion Events */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Conversion Events (Mock)</h3>
          <span className="admin-badge admin-badge-info">GA4 + Meta Pixel</span>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Count</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'ViewContent (Product View)', count: 456, trend: '+14%' },
                { event: 'AddToWishlist', count: 89, trend: '+8%' },
                { event: 'Lead (Contact Form)', count: inquiries.length, trend: 'N/A' },
                { event: 'WhatsApp Click', count: 87, trend: '+12%' },
                { event: 'Phone Call Click', count: 34, trend: '+5%' },
                { event: 'Showroom Direction Click', count: 23, trend: '+3%' },
              ].map((e) => (
                <tr key={e.event}>
                  <td style={{ fontWeight: '500', fontSize: '13px', color: 'var(--walnut-dark)' }}>{e.event}</td>
                  <td style={{ fontWeight: '600' }}>{e.count}</td>
                  <td>
                    <span className="admin-metric-change positive" style={{ fontSize: '12px' }}>
                      {e.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

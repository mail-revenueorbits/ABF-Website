import React, { useState, useEffect } from 'react';
import useBannerStore from '../../store/bannerStore';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/AdminToast';

const EMPTY_BANNER = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  linkText: '',
  position: 'hero',
  active: true,
  order: 1,
  startDate: '',
  endDate: '',
};

function BannersPage() {
  const banners = useBannerStore((s) => s.banners);
  const addBanner = useBannerStore((s) => s.addBanner);
  const updateBanner = useBannerStore((s) => s.updateBanner);
  const deleteBanner = useBannerStore((s) => s.deleteBanner);
  const toggleBanner = useBannerStore((s) => s.toggleBanner);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_BANNER);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({
        ...EMPTY_BANNER,
        ...editing,
        startDate: editing.startDate ? editing.startDate.slice(0, 10) : '',
        endDate: editing.endDate ? editing.endDate.slice(0, 10) : '',
      });
    } else {
      setForm(EMPTY_BANNER);
    }
    setErrors({});
  }, [editing, isFormOpen]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    };

    if (editing) {
      updateBanner(editing.id, data);
      showToast('Banner updated');
    } else {
      addBanner(data);
      showToast('Banner created');
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  const handleImageChange = (images) => {
    updateField('imageUrl', images[0] || '');
  };

  const positionLabels = {
    hero: 'Homepage Hero',
    promo_bar: 'Promotion Bar',
    category_banner: 'Category Banner',
  };

  // Group by position
  const grouped = {};
  banners.forEach((b) => {
    if (!grouped[b.position]) grouped[b.position] = [];
    grouped[b.position].push(b);
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Banners & Promotions</h1>
          <p className="admin-page-subtitle">Manage hero banners, sale announcements, and promotions</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditing(null); setIsFormOpen(true); }}>
          <span className="material-symbols-outlined">add</span>
          Add Banner
        </button>
      </div>

      {/* Banner groups */}
      {Object.entries(positionLabels).map(([pos, label]) => {
        const items = grouped[pos] || [];
        return (
          <div key={pos} style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--walnut)', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {label}
            </h3>

            {items.length === 0 ? (
              <div className="admin-card">
                <div className="admin-empty" style={{ padding: '32px' }}>
                  <span className="material-symbols-outlined">image</span>
                  <p>No banners in this position</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {items.map((banner) => (
                  <div key={banner.id} className="admin-card" style={{ opacity: banner.active ? 1 : 0.6 }}>
                    {banner.imageUrl && (
                      <div style={{ height: '160px', overflow: 'hidden', background: '#F5F2ED' }}>
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="admin-card-body" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--walnut-dark)' }}>{banner.title}</h4>
                          {banner.subtitle && (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{banner.subtitle}</p>
                          )}
                        </div>
                        <span className={`admin-badge ${banner.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                          {banner.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {(banner.startDate || banner.endDate) && (
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {banner.startDate && `From: ${new Date(banner.startDate).toLocaleDateString()}`}
                          {banner.startDate && banner.endDate && ' — '}
                          {banner.endDate && `Until: ${new Date(banner.endDate).toLocaleDateString()}`}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => toggleBanner(banner.id)}
                        >
                          {banner.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => { setEditing(banner); setIsFormOpen(true); }}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(banner.id)}
                          style={{ color: '#C53030' }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Banner Form Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit Banner' : 'Add Banner'}
        large
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => { setIsFormOpen(false); setEditing(null); }}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}>
              <span className="material-symbols-outlined">save</span>
              {editing ? 'Save Changes' : 'Create Banner'}
            </button>
          </>
        }
      >
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label admin-form-required">Title</label>
            <input
              type="text"
              className={`admin-input ${errors.title ? 'admin-input-error' : ''}`}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Dashain Mega Sale"
            />
            {errors.title && <p className="admin-form-error">{errors.title}</p>}
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Subtitle</label>
            <input
              type="text"
              className="admin-input"
              value={form.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="e.g. Up to 30% off on all sofas"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Position</label>
            <select
              className="admin-select"
              value={form.position}
              onChange={(e) => updateField('position', e.target.value)}
            >
              <option value="hero">Homepage Hero</option>
              <option value="promo_bar">Promotion Bar</option>
              <option value="category_banner">Category Banner</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Display Order</label>
            <input
              type="number"
              className="admin-input"
              value={form.order}
              onChange={(e) => updateField('order', parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Banner Image</label>
          <ImageUploader
            images={form.imageUrl ? [form.imageUrl] : []}
            onChange={handleImageChange}
            maxImages={1}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Link URL</label>
            <input
              type="text"
              className="admin-input"
              value={form.linkUrl}
              onChange={(e) => updateField('linkUrl', e.target.value)}
              placeholder="e.g. /shop?category=sofas"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Button Text</label>
            <input
              type="text"
              className="admin-input"
              value={form.linkText}
              onChange={(e) => updateField('linkText', e.target.value)}
              placeholder="e.g. Shop Now"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Start Date (optional)</label>
            <input
              type="date"
              className="admin-input"
              value={form.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">End Date (optional)</label>
            <input
              type="date"
              className="admin-input"
              value={form.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="admin-checkbox-wrapper">
          <input
            type="checkbox"
            className="admin-checkbox"
            id="bannerActive"
            checked={form.active}
            onChange={(e) => updateField('active', e.target.checked)}
          />
          <label htmlFor="bannerActive" className="admin-form-label" style={{ cursor: 'pointer' }}>
            Active (visible on website)
          </label>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteBanner(deleteId); showToast('Banner deleted'); }}
        title="Delete Banner"
        message="Are you sure you want to delete this banner?"
        confirmText="Delete"
      />
    </div>
  );
}

export default BannersPage;

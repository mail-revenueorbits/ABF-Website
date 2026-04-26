import React, { useState } from 'react';
import useInquiryStore from '../../store/inquiryStore';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/AdminToast';

function InquiriesPage() {
  const inquiries = useInquiryStore((s) => s.inquiries);
  const updateStatus = useInquiryStore((s) => s.updateStatus);
  const updateInquiry = useInquiryStore((s) => s.updateInquiry);
  const deleteInquiry = useInquiryStore((s) => s.deleteInquiry);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [notes, setNotes] = useState('');

  const statusCounts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    replied: inquiries.filter((i) => i.status === 'replied').length,
    closed: inquiries.filter((i) => i.status === 'closed').length,
  };

  const filtered = inquiries
    .filter((inq) => {
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          inq.name.toLowerCase().includes(q) ||
          inq.email?.toLowerCase().includes(q) ||
          inq.phone?.includes(q) ||
          inq.productOfInterest?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const openDetail = (inq) => {
    setSelectedInquiry(inq);
    setNotes(inq.notes || '');
  };

  const handleStatusChange = (id, status) => {
    updateStatus(id, status);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
    showToast(`Inquiry marked as ${status}`);
  };

  const handleSaveNotes = () => {
    updateInquiry(selectedInquiry.id, { notes });
    showToast('Notes saved');
  };

  const statusBadge = (status) => {
    const map = {
      new: { cls: 'admin-badge-warning', icon: 'mark_email_unread', label: 'New' },
      replied: { cls: 'admin-badge-info', icon: 'reply', label: 'Replied' },
      closed: { cls: 'admin-badge-success', icon: 'check_circle', label: 'Closed' },
    };
    const s = map[status] || map.new;
    return (
      <span className={`admin-badge ${s.cls}`}>
        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{s.icon}</span>
        {s.label}
      </span>
    );
  };

  const contactIcon = (method) => {
    const map = { whatsapp: 'chat', phone: 'call', email: 'mail', showroom: 'storefront' };
    return map[method] || 'contact_support';
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Inquiries</h1>
          <p className="admin-page-subtitle">{statusCounts.new > 0 ? `${statusCounts.new} new inquiry(ies) need attention` : 'All caught up'}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="admin-tabs">
        {['all', 'new', 'replied', 'closed'].map((status) => (
          <button
            key={status}
            className={`admin-tab ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="admin-input"
            placeholder="Search by name, email, phone, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Budget</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty">
                      <span className="material-symbols-outlined">inbox</span>
                      <h3>No inquiries found</h3>
                      <p>{statusFilter !== 'all' ? 'Try a different filter.' : 'No customer inquiries yet.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(inq)}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--walnut-dark)', fontSize: '13px' }}>{inq.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inq.email}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{inq.productOfInterest}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inq.budgetRange}</td>
                    <td>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--teal)' }}>
                        {contactIcon(inq.preferredContact)}
                      </span>
                    </td>
                    <td>{statusBadge(inq.status)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                        {inq.status === 'new' && (
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => handleStatusChange(inq.id, 'replied')}
                            title="Mark as Replied"
                          >
                            <span className="material-symbols-outlined">reply</span>
                          </button>
                        )}
                        {inq.status !== 'closed' && (
                          <button
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => handleStatusChange(inq.id, 'closed')}
                            title="Mark as Closed"
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(inq.id)}
                          title="Delete"
                          style={{ color: '#C53030' }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      <AdminModal
        isOpen={selectedInquiry !== null}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        large
        footer={
          <>
            {selectedInquiry?.status !== 'closed' && (
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  const nextStatus = selectedInquiry.status === 'new' ? 'replied' : 'closed';
                  handleStatusChange(selectedInquiry.id, nextStatus);
                }}
              >
                Mark as {selectedInquiry?.status === 'new' ? 'Replied' : 'Closed'}
              </button>
            )}
            <button className="admin-btn admin-btn-primary" onClick={() => setSelectedInquiry(null)}>
              Close
            </button>
          </>
        }
      >
        {selectedInquiry && (
          <>
            {/* Customer info grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              padding: '16px 20px',
              background: 'rgba(112,74,46,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(112,74,46,0.06)',
            }}>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Name</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedInquiry.name}</div>
              </div>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Phone</div>
                <div style={{ fontSize: '14px' }}>
                  <a href={`tel:${selectedInquiry.phone}`} style={{ color: 'var(--teal)', textDecoration: 'underline' }}>
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Email</div>
                <div style={{ fontSize: '14px' }}>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--teal)', textDecoration: 'underline' }}>
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Preferred Contact</div>
                <div style={{ fontSize: '14px', textTransform: 'capitalize' }}>{selectedInquiry.preferredContact}</div>
              </div>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Product of Interest</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedInquiry.productOfInterest}</div>
              </div>
              <div>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Budget Range</div>
                <div style={{ fontSize: '14px' }}>{selectedInquiry.budgetRange}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-form-label" style={{ marginBottom: '4px' }}>Delivery Location</div>
                <div style={{ fontSize: '14px' }}>{selectedInquiry.deliveryLocation}</div>
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="admin-form-label" style={{ marginBottom: '8px' }}>Message</div>
              <div style={{
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid rgba(112,74,46,0.1)',
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
              }}>
                {selectedInquiry.message}
              </div>
            </div>

            {/* WhatsApp quick-reply */}
            {selectedInquiry.phone && (
              <div>
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${selectedInquiry.name}, thank you for your interest in ${selectedInquiry.productOfInterest}. `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  style={{ display: 'inline-flex' }}
                >
                  <span className="material-symbols-outlined">chat</span>
                  Reply via WhatsApp
                </a>
              </div>
            )}

            {/* Internal Notes */}
            <div className="admin-form-group">
              <label className="admin-form-label">Internal Notes</label>
              <textarea
                className="admin-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this inquiry (not visible to customer)"
                rows={3}
              />
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={handleSaveNotes}
                style={{ marginTop: '8px', alignSelf: 'flex-start' }}
              >
                Save Notes
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Status: {statusBadge(selectedInquiry.status)}</span>
              <span>Received: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
            </div>
          </>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteInquiry(deleteId); showToast('Inquiry deleted'); }}
        title="Delete Inquiry"
        message="Are you sure you want to delete this customer inquiry?"
        confirmText="Delete"
      />
    </div>
  );
}

export default InquiriesPage;

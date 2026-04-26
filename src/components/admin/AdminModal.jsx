import React, { useEffect } from 'react';

/**
 * Reusable modal wrapper for admin panel.
 * Props: isOpen, onClose, title, children, footer, large
 */
function AdminModal({ isOpen, onClose, title, children, footer, large }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className={`admin-modal ${large ? 'admin-modal-lg' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{title}</h2>
          <button className="admin-btn-ghost" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="admin-modal-body">
          {children}
        </div>

        {footer && (
          <div className="admin-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;

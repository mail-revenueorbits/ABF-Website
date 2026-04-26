import React from 'react';
import AdminModal from './AdminModal';

/**
 * Confirmation dialog for destructive actions.
 * Props: isOpen, onClose, onConfirm, title, message, confirmText, danger
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', danger = true }) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="admin-confirm-text">{message}</p>
    </AdminModal>
  );
}

export default ConfirmDialog;

import React, { useEffect } from 'react';
import { create } from 'zustand';

/**
 * Lightweight toast notification store and component.
 * Usage:  import { showToast } from './AdminToast';
 *         showToast('Product saved successfully');
 *         showToast('Error occurred', 'error');
 */

export const useToastStore = create((set) => ({
  message: '',
  type: 'success', // 'success' | 'error'
  visible: false,

  show: (message, type = 'success') => {
    set({ message, type, visible: true });
  },

  hide: () => {
    set({ visible: false });
  },
}));

export function showToast(message, type = 'success') {
  useToastStore.getState().show(message, type);
}

function AdminToast() {
  const { message, type, visible, hide } = useToastStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(hide, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, hide]);

  if (!visible) return null;

  const icon = type === 'error' ? 'error' : 'check_circle';
  const bg = type === 'error' ? '#C53030' : 'var(--walnut-dark)';

  return (
    <div className="admin-toast" style={{ background: bg }}>
      <span className="material-symbols-outlined">{icon}</span>
      {message}
    </div>
  );
}

export default AdminToast;

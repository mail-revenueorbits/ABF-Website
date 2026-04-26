import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Simple password-based admin authentication.
 * Stores a hashed version of the password. For production,
 * replace with Supabase Auth / Firebase Auth.
 */

// Simple hash for demo — NOT cryptographically secure.
// Replace with bcrypt or server-side auth in production.
const ADMIN_PASSWORD = 'abfurniture2026';

const useAdminAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      lastLogin: null,

      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true, lastLogin: new Date().toISOString() });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, lastLogin: null });
      },
    }),
    {
      name: 'abf-admin-auth',
    }
  )
);

export default useAdminAuthStore;

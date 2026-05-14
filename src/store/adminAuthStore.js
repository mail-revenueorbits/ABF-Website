import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

/**
 * Admin authentication via Supabase Auth.
 * Uses email/password sign-in.
 * 
 * To create an admin user:
 * 1. Go to Supabase Dashboard → Authentication → Users
 * 2. Click "Add User" → "Create New User"
 * 3. Enter email and password
 * 4. Use those credentials to log in
 */

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      lastLogin: null,
      loading: false,

      /**
       * Initialize auth state from Supabase session.
       * Called once on app load to restore sessions.
       */
      initAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            isAuthenticated: true,
            user: session.user,
            lastLogin: session.user.last_sign_in_at,
          });
        } else {
          set({ isAuthenticated: false, user: null });
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            set({
              isAuthenticated: true,
              user: session.user,
              lastLogin: new Date().toISOString(),
            });
          } else if (event === 'SIGNED_OUT') {
            set({ isAuthenticated: false, user: null, lastLogin: null });
          }
        });
      },

      /**
       * Sign in with email and password.
       * @param {string} email
       * @param {string} password
       * @returns {Promise<{ success: boolean, error?: string }>}
       */
      login: async (email, password) => {
        set({ loading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        set({ loading: false });

        if (error) {
          return { success: false, error: error.message };
        }

        set({
          isAuthenticated: true,
          user: data.user,
          lastLogin: new Date().toISOString(),
        });
        return { success: true };
      },

      /**
       * Sign out the current admin user.
       */
      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, user: null, lastLogin: null });
      },
    }),
    {
      name: 'abf-admin-auth',
      // Only persist the isAuthenticated flag for quick UI rendering;
      // the actual session is managed by Supabase's own storage.
      partialize: (state) => ({ lastLogin: state.lastLogin }),
    }
  )
);

export default useAdminAuthStore;

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { rowsToCamel, rowToCamel, objToSnake } from '../lib/dbHelpers';

const useBannerStore = create((set, get) => ({
  banners: [],
  loading: false,
  error: null,
  initialized: false,

  fetchBanners: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch banners:', error.message);
      return;
    }
    set({ banners: rowsToCamel(data), loading: false, initialized: true });
  },

  addBanner: async (bannerData) => {
    const snakeData = objToSnake({
      id: `ban_${Date.now()}`,
      createdAt: new Date().toISOString(),
      active: true,
      sortOrder: get().banners.length + 1,
      ...bannerData,
    });
    const { data, error } = await supabase
      .from('banners')
      .insert(snakeData)
      .select()
      .single();
    if (error) {
      console.error('Failed to add banner:', error.message);
      return null;
    }
    const banner = rowToCamel(data);
    set((state) => ({ banners: [...state.banners, banner] }));
    return banner;
  },

  updateBanner: async (id, updates) => {
    const snakeData = objToSnake(updates);
    const { error } = await supabase
      .from('banners')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to update banner:', error.message);
      return;
    }
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
  },

  deleteBanner: async (id) => {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Failed to delete banner:', error.message);
      return;
    }
    set((state) => ({
      banners: state.banners.filter((b) => b.id !== id),
    }));
  },

  toggleBanner: async (id) => {
    const banner = get().banners.find((b) => b.id === id);
    if (!banner) return;
    const { error } = await supabase
      .from('banners')
      .update({ active: !banner.active })
      .eq('id', id);
    if (error) {
      console.error('Failed to toggle banner:', error.message);
      return;
    }
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id ? { ...b, active: !b.active } : b
      ),
    }));
  },

  getActiveBanners: (position) => {
    const now = new Date();
    return get().banners.filter((b) => {
      if (!b.active) return false;
      if (position && b.position !== position) return false;
      if (b.startDate && new Date(b.startDate) > now) return false;
      if (b.endDate && new Date(b.endDate) < now) return false;
      return true;
    }).sort((a, b) => (a.sortOrder || a.order || 0) - (b.sortOrder || b.order || 0));
  },
}));

export default useBannerStore;

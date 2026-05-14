import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { rowsToCamel, rowToCamel, objToSnake } from '../lib/dbHelpers';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  initialized: false,

  /**
   * Fetch all categories from Supabase.
   * Called once on app init.
   */
  fetchCategories: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch categories:', error.message);
      return;
    }
    set({ categories: rowsToCamel(data), loading: false, initialized: true });
  },

  addCategory: async (categoryData) => {
    const snakeData = objToSnake({
      ...categoryData,
      id: categoryData.id || `cat_${Date.now()}`,
      sortOrder: get().categories.length + 1,
    });
    const { data, error } = await supabase
      .from('categories')
      .insert(snakeData)
      .select()
      .single();
    if (error) {
      console.error('Failed to add category:', error.message);
      return null;
    }
    const category = rowToCamel(data);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  updateCategory: async (id, updates) => {
    const snakeData = objToSnake({ ...updates, updatedAt: new Date().toISOString() });
    const { error } = await supabase
      .from('categories')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to update category:', error.message);
      return;
    }
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Failed to delete category:', error.message);
      return;
    }
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id);
  },
}));

export default useCategoryStore;

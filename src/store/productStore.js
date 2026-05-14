import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { rowsToCamel, rowToCamel, objToSnake } from '../lib/dbHelpers';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  initialized: false,

  /**
   * Fetch all products from Supabase.
   * Admin sees all; public pages use getPublishedProducts().
   */
  fetchProducts: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch products:', error.message);
      return;
    }
    set({ products: rowsToCamel(data), loading: false, initialized: true });
  },

  /**
   * Fetch ALL products (including unpublished) for admin panel.
   * Requires authenticated session.
   */
  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch all products:', error.message);
      return;
    }
    set({ products: rowsToCamel(data), loading: false, initialized: true });
  },

  addProduct: async (productData) => {
    const now = new Date().toISOString();
    const id = productData.id || `prod_${Date.now()}`;
    const snakeData = objToSnake({
      id,
      createdAt: now,
      updatedAt: now,
      published: false,
      featured: false,
      onSale: false,
      salePrice: null,
      tags: [],
      images: [],
      features: [],
      variants: [],
      dimensions: {},
      popularity: 0,
      ...productData,
    });
    // Ensure JSONB fields are stringified
    if (typeof snakeData.images !== 'string') snakeData.images = JSON.stringify(snakeData.images || []);
    if (typeof snakeData.tags !== 'string') snakeData.tags = JSON.stringify(snakeData.tags || []);
    if (typeof snakeData.features !== 'string') snakeData.features = JSON.stringify(snakeData.features || []);
    if (typeof snakeData.variants !== 'string') snakeData.variants = JSON.stringify(snakeData.variants || []);
    if (typeof snakeData.dimensions !== 'string') snakeData.dimensions = JSON.stringify(snakeData.dimensions || {});

    const { data, error } = await supabase
      .from('products')
      .insert(snakeData)
      .select()
      .single();
    if (error) {
      console.error('Failed to add product:', error.message);
      return null;
    }
    const product = rowToCamel(data);
    set((state) => ({ products: [product, ...state.products] }));
    return product;
  },

  updateProduct: async (id, updates) => {
    const snakeData = objToSnake({ ...updates, updatedAt: new Date().toISOString() });
    // Ensure JSONB fields are stringified
    if (snakeData.images && typeof snakeData.images !== 'string') snakeData.images = JSON.stringify(snakeData.images);
    if (snakeData.tags && typeof snakeData.tags !== 'string') snakeData.tags = JSON.stringify(snakeData.tags);
    if (snakeData.features && typeof snakeData.features !== 'string') snakeData.features = JSON.stringify(snakeData.features);
    if (snakeData.variants && typeof snakeData.variants !== 'string') snakeData.variants = JSON.stringify(snakeData.variants);
    if (snakeData.dimensions && typeof snakeData.dimensions !== 'string') snakeData.dimensions = JSON.stringify(snakeData.dimensions);

    const { error } = await supabase
      .from('products')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to update product:', error.message);
      return;
    }
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Failed to delete product:', error.message);
      return;
    }
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  deleteProducts: async (ids) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', ids);
    if (error) {
      console.error('Failed to delete products:', error.message);
      return;
    }
    set((state) => ({
      products: state.products.filter((p) => !ids.includes(p.id)),
    }));
  },

  toggleSale: async (id, salePrice) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const updates = {
      onSale: !product.onSale,
      salePrice: product.onSale ? null : salePrice,
      updatedAt: new Date().toISOString(),
    };
    const snakeData = objToSnake(updates);
    const { error } = await supabase
      .from('products')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to toggle sale:', error.message);
      return;
    }
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  bulkUpdateCategory: async (ids, categoryId) => {
    const { error } = await supabase
      .from('products')
      .update({ category_id: categoryId, updated_at: new Date().toISOString() })
      .in('id', ids);
    if (error) {
      console.error('Failed to bulk update category:', error.message);
      return;
    }
    set((state) => ({
      products: state.products.map((p) =>
        ids.includes(p.id)
          ? { ...p, categoryId, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },

  getProductsByCategory: (categoryId) => {
    if (!categoryId) return get().products;
    return get().products.filter((p) => p.categoryId === categoryId);
  },

  getFeaturedProducts: () => {
    return get().products.filter((p) => p.featured && p.published);
  },

  getPublishedProducts: () => {
    return get().products.filter((p) => p.published);
  },
}));

export default useProductStore;

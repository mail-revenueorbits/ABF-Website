import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';
import { products as CATALOG_PRODUCTS } from '../data/products';

/**
 * Product schema:
 * {
 *   id: string,
 *   name: string,
 *   slug: string,
 *   description: string (HTML from WYSIWYG),
 *   categoryId: string,
 *   price: number (in NPR),
 *   salePrice: number | null,
 *   onSale: boolean,
 *   images: string[] (data-URLs or CDN urls),
 *   material: string,
 *   dimensions: { height: string, width: string, depth: string },
 *   weight: string,
 *   colorOptions: string,
 *   seatingCapacity: string,
 *   warranty: string,
 *   careInstructions: string,
 *   assemblyRequired: boolean,
 *   deliveryInfo: string,
 *   stockStatus: 'in_stock' | 'made_to_order' | 'out_of_stock',
 *   sku: string,
 *   tags: string[],
 *   featured: boolean,
 *   published: boolean,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO),
 * }
 */

// Seed the admin store with plain-text descriptions. The admin's rich-text
// editor will convert to HTML on edit, which we strip back to plain text for
// display on the PDP. Keeping one canonical field avoids divergence between
// seeded and admin-edited products.
const SEED_PRODUCTS = CATALOG_PRODUCTS.map((p) => ({
  ...p,
  description: p.description || '',
}));

const useProductStore = create(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,

      addProduct: (data) => {
        const now = new Date().toISOString();
        const product = {
          id: generateId('prod'),
          createdAt: now,
          updatedAt: now,
          published: false,
          featured: false,
          onSale: false,
          salePrice: null,
          tags: [],
          images: [],
          ...data,
        };
        set((state) => ({ products: [product, ...state.products] }));
        return product;
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      deleteProducts: (ids) => {
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id)),
        }));
      },

      toggleSale: (id, salePrice) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, onSale: !p.onSale, salePrice: p.onSale ? null : salePrice, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      bulkUpdateCategory: (ids, categoryId) => {
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
    }),
    {
      // Bump the key when the catalogue schema changes so existing clients
      // refresh their localStorage with the new seed data.
      name: 'abf-products-v3',
    }
  )
);

export default useProductStore;

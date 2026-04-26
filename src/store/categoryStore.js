import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';

const DEFAULT_CATEGORIES = [
  { id: 'cat_sofas', name: 'Sofas & Sofa Sets', slug: 'sofas', parentId: null, order: 1 },
  { id: 'cat_dining', name: 'Dining Tables & Sets', slug: 'dining', parentId: null, order: 2 },
  { id: 'cat_beds', name: 'Beds', slug: 'beds', parentId: null, order: 3 },
  { id: 'cat_office', name: 'Office Chairs', slug: 'office-chairs', parentId: null, order: 4 },
  { id: 'cat_gaming', name: 'Gaming Chairs', slug: 'gaming-chairs', parentId: null, order: 5 },
  { id: 'cat_cafe', name: 'Cafe Chairs', slug: 'cafe-chairs', parentId: null, order: 6 },
  { id: 'cat_rocking', name: 'Rocking Chairs', slug: 'rocking-chairs', parentId: null, order: 7 },
  { id: 'cat_bar', name: 'Bar Units & Bar Tables', slug: 'bar-units', parentId: null, order: 8 },
  { id: 'cat_console', name: 'Console Tables & Sets', slug: 'console-tables', parentId: null, order: 9 },
  { id: 'cat_dressing', name: 'Dressing Tables', slug: 'dressing-tables', parentId: null, order: 10 },
  { id: 'cat_side', name: 'Side Tables / Nightstands', slug: 'side-tables', parentId: null, order: 11 },
  { id: 'cat_tea', name: 'Tea Tables', slug: 'tea-tables', parentId: null, order: 12 },
  { id: 'cat_wardrobe', name: 'Wardrobes', slug: 'wardrobes', parentId: null, order: 13 },
  { id: 'cat_ottoman', name: 'Mudas / Ottomans', slug: 'ottomans', parentId: null, order: 14 },
  { id: 'cat_bench', name: 'Benches', slug: 'benches', parentId: null, order: 15 },
  { id: 'cat_mirror', name: 'Mirrors', slug: 'mirrors', parentId: null, order: 16 },
  { id: 'cat_cabinet', name: 'Utility Cabinets', slug: 'cabinets', parentId: null, order: 17 },
  { id: 'cat_curtain', name: 'Curtains', slug: 'curtains', parentId: null, order: 18 },
  { id: 'cat_carpet', name: 'Carpets', slug: 'carpets', parentId: null, order: 19 },
  { id: 'cat_wallpaper', name: 'Wallpapers', slug: 'wallpapers', parentId: null, order: 20 },
  { id: 'cat_flooring', name: 'Flooring', slug: 'flooring', parentId: null, order: 21 },
  { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', parentId: null, order: 22 },
];

const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (data) => {
        const category = {
          id: generateId('cat'),
          order: get().categories.length + 1,
          ...data,
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      getCategoryById: (id) => {
        return get().categories.find((c) => c.id === id);
      },
    }),
    {
      name: 'abf-categories-v2',
    }
  )
);

export default useCategoryStore;

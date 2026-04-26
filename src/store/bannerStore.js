import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';

/**
 * Banner schema:
 * {
 *   id: string,
 *   title: string,
 *   subtitle: string,
 *   imageUrl: string,
 *   linkUrl: string,
 *   linkText: string,
 *   position: 'hero' | 'promo_bar' | 'category_banner',
 *   active: boolean,
 *   order: number,
 *   startDate: string | null (ISO),
 *   endDate: string | null (ISO),
 *   createdAt: string,
 * }
 */

const SEED_BANNERS = [
  {
    id: 'ban_001',
    title: 'Monsoon Sale',
    subtitle: 'Up to 30% off on Sofas & Dining Sets',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format',
    linkUrl: '/shop?category=sofas',
    linkText: 'Shop Now',
    position: 'hero',
    active: true,
    order: 1,
    startDate: null,
    endDate: null,
    createdAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'ban_002',
    title: 'Free Delivery Inside Kathmandu Valley',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    linkText: '',
    position: 'promo_bar',
    active: true,
    order: 1,
    startDate: null,
    endDate: null,
    createdAt: '2026-04-20T10:00:00Z',
  },
];

const useBannerStore = create(
  persist(
    (set, get) => ({
      banners: SEED_BANNERS,

      addBanner: (data) => {
        const banner = {
          id: generateId('ban'),
          createdAt: new Date().toISOString(),
          active: true,
          order: get().banners.length + 1,
          ...data,
        };
        set((state) => ({ banners: [...state.banners, banner] }));
        return banner;
      },

      updateBanner: (id, data) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
      },

      deleteBanner: (id) => {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
      },

      toggleBanner: (id) => {
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
        }).sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'abf-banners',
    }
  )
);

export default useBannerStore;

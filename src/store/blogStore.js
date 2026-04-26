import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';

/**
 * Blog post schema:
 * {
 *   id: string,
 *   title: string,
 *   slug: string,
 *   excerpt: string,
 *   content: string (HTML from WYSIWYG),
 *   coverImage: string,
 *   author: string,
 *   tags: string[],
 *   published: boolean,
 *   createdAt: string,
 *   updatedAt: string,
 * }
 */

const SEED_POSTS = [
  {
    id: 'blog_001',
    title: 'How to Choose the Perfect Sofa for Your Living Room',
    slug: 'how-to-choose-perfect-sofa',
    excerpt: 'A comprehensive guide to selecting the right sofa size, material, and style for Nepali homes.',
    content: '<h2>Finding Your Ideal Sofa</h2><p>Choosing the right sofa is one of the most important furniture decisions you will make. It sets the tone for your entire living room.</p><h3>1. Consider Your Space</h3><p>Measure your room before visiting the showroom. A 5-seater is ideal for most Nepali living rooms, while a 7 or 10-seater works for larger spaces.</p><h3>2. Material Matters</h3><p>For Kathmandu\'s climate, we recommend fabrics that resist moisture and are easy to clean. Velvet offers a premium look while being practical.</p><h3>3. Frame Quality</h3><p>Always check the frame material. Teak and Sheesham wood frames last decades, while softwood frames may warp over time.</p>',
    coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format',
    author: 'AB Furniture Team',
    tags: ['sofas', 'guide', 'living room'],
    published: true,
    createdAt: '2026-04-22T10:00:00Z',
    updatedAt: '2026-04-22T10:00:00Z',
  },
];

const useBlogStore = create(
  persist(
    (set, get) => ({
      posts: SEED_POSTS,

      addPost: (data) => {
        const now = new Date().toISOString();
        const post = {
          id: generateId('blog'),
          createdAt: now,
          updatedAt: now,
          published: false,
          tags: [],
          ...data,
        };
        set((state) => ({ posts: [post, ...state.posts] }));
        return post;
      },

      updatePost: (id, data) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));
      },

      togglePublish: (id) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id
              ? { ...p, published: !p.published, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      getPostById: (id) => {
        return get().posts.find((p) => p.id === id);
      },

      getPublishedPosts: () => {
        return get().posts.filter((p) => p.published);
      },
    }),
    {
      name: 'abf-blog',
    }
  )
);

export default useBlogStore;

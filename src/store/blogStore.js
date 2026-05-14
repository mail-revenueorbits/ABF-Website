import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { rowsToCamel, rowToCamel, objToSnake } from '../lib/dbHelpers';

const useBlogStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  initialized: false,

  fetchPosts: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch blog posts:', error.message);
      return;
    }
    set({ posts: rowsToCamel(data), loading: false, initialized: true });
  },

  addPost: async (postData) => {
    const now = new Date().toISOString();
    const snakeData = objToSnake({
      id: `blog_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      published: false,
      tags: [],
      ...postData,
    });
    if (typeof snakeData.tags !== 'string') snakeData.tags = JSON.stringify(snakeData.tags || []);

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(snakeData)
      .select()
      .single();
    if (error) {
      console.error('Failed to add blog post:', error.message);
      return null;
    }
    const post = rowToCamel(data);
    set((state) => ({ posts: [post, ...state.posts] }));
    return post;
  },

  updatePost: async (id, updates) => {
    const snakeData = objToSnake({ ...updates, updatedAt: new Date().toISOString() });
    if (snakeData.tags && typeof snakeData.tags !== 'string') snakeData.tags = JSON.stringify(snakeData.tags);

    const { error } = await supabase
      .from('blog_posts')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to update blog post:', error.message);
      return;
    }
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  deletePost: async (id) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Failed to delete blog post:', error.message);
      return;
    }
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },

  togglePublish: async (id) => {
    const post = get().posts.find((p) => p.id === id);
    if (!post) return;
    const updates = {
      published: !post.published,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id);
    if (error) {
      console.error('Failed to toggle publish:', error.message);
      return;
    }
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, published: !p.published, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },

  getPostById: (id) => {
    return get().posts.find((p) => p.id === id);
  },

  getPublishedPosts: () => {
    return get().posts.filter((p) => p.published);
  },
}));

export default useBlogStore;

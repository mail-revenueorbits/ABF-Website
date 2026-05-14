import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { rowsToCamel, rowToCamel, objToSnake } from '../lib/dbHelpers';

const useInquiryStore = create((set, get) => ({
  inquiries: [],
  loading: false,
  error: null,
  initialized: false,

  fetchInquiries: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch inquiries:', error.message);
      return;
    }
    set({ inquiries: rowsToCamel(data), loading: false, initialized: true });
  },

  addInquiry: async (inquiryData) => {
    const now = new Date().toISOString();
    const snakeData = objToSnake({
      id: `inq_${Date.now()}`,
      status: 'new',
      notes: '',
      createdAt: now,
      updatedAt: now,
      ...inquiryData,
    });
    const { data, error } = await supabase
      .from('inquiries')
      .insert(snakeData)
      .select()
      .single();
    if (error) {
      console.error('Failed to add inquiry:', error.message);
      return null;
    }
    const inquiry = rowToCamel(data);
    set((state) => ({ inquiries: [inquiry, ...state.inquiries] }));
    return inquiry;
  },

  updateInquiry: async (id, updates) => {
    const snakeData = objToSnake({ ...updates, updatedAt: new Date().toISOString() });
    const { error } = await supabase
      .from('inquiries')
      .update(snakeData)
      .eq('id', id);
    if (error) {
      console.error('Failed to update inquiry:', error.message);
      return;
    }
    set((state) => ({
      inquiries: state.inquiries.map((inq) =>
        inq.id === id ? { ...inq, ...updates, updatedAt: new Date().toISOString() } : inq
      ),
    }));
  },

  updateStatus: async (id, status) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Failed to update status:', error.message);
      return;
    }
    set((state) => ({
      inquiries: state.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status, updatedAt: new Date().toISOString() } : inq
      ),
    }));
  },

  deleteInquiry: async (id) => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Failed to delete inquiry:', error.message);
      return;
    }
    set((state) => ({
      inquiries: state.inquiries.filter((inq) => inq.id !== id),
    }));
  },

  getByStatus: (status) => {
    if (!status || status === 'all') return get().inquiries;
    return get().inquiries.filter((inq) => inq.status === status);
  },

  getNewCount: () => {
    return get().inquiries.filter((inq) => inq.status === 'new').length;
  },
}));

export default useInquiryStore;

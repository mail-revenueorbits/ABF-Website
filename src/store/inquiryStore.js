import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';

/**
 * Inquiry schema:
 * {
 *   id: string,
 *   name: string,
 *   phone: string,
 *   email: string,
 *   productOfInterest: string,
 *   budgetRange: string,
 *   preferredContact: 'whatsapp' | 'phone' | 'email' | 'showroom',
 *   message: string,
 *   deliveryLocation: string,
 *   status: 'new' | 'replied' | 'closed',
 *   notes: string,
 *   createdAt: string,
 *   updatedAt: string,
 * }
 */

const SEED_INQUIRIES = [
  {
    id: 'inq_001',
    name: 'Ramesh Sharma',
    phone: '+977 984-1234567',
    email: 'ramesh@gmail.com',
    productOfInterest: 'Royal Sofa Set',
    budgetRange: 'Rs. 3,00,000 - Rs. 5,00,000',
    preferredContact: 'whatsapp',
    message: 'I am interested in the Royal Sofa Set. Can you share more photos and available color options?',
    deliveryLocation: 'Lalitpur, Kathmandu Valley',
    status: 'new',
    notes: '',
    createdAt: '2026-04-25T08:30:00Z',
    updatedAt: '2026-04-25T08:30:00Z',
  },
  {
    id: 'inq_002',
    name: 'Sunita Patel',
    phone: '+977 980-9876543',
    email: 'sunita.patel@yahoo.com',
    productOfInterest: 'Marble Top Dining Set',
    budgetRange: 'Rs. 1,50,000 - Rs. 2,00,000',
    preferredContact: 'phone',
    message: 'We are furnishing our new home. Need a dining set for 8 people. Do you have 8-seater options?',
    deliveryLocation: 'Baneshwor, Kathmandu',
    status: 'replied',
    notes: 'Called back. Scheduled showroom visit for April 27.',
    createdAt: '2026-04-24T14:15:00Z',
    updatedAt: '2026-04-25T09:00:00Z',
  },
  {
    id: 'inq_003',
    name: 'Anil KC',
    phone: '+977 986-5551234',
    email: 'anil.kc@hotmail.com',
    productOfInterest: 'Office Chairs',
    budgetRange: 'Rs. 50,000 - Rs. 1,00,000',
    preferredContact: 'whatsapp',
    message: 'We need 5 ergonomic office chairs for our new office. Do you offer bulk discounts?',
    deliveryLocation: 'Thamel, Kathmandu',
    status: 'closed',
    notes: 'Ordered 5 chairs. Delivered on April 23.',
    createdAt: '2026-04-20T11:00:00Z',
    updatedAt: '2026-04-23T16:00:00Z',
  },
];

const useInquiryStore = create(
  persist(
    (set, get) => ({
      inquiries: SEED_INQUIRIES,

      addInquiry: (data) => {
        const now = new Date().toISOString();
        const inquiry = {
          id: generateId('inq'),
          status: 'new',
          notes: '',
          createdAt: now,
          updatedAt: now,
          ...data,
        };
        set((state) => ({ inquiries: [inquiry, ...state.inquiries] }));
        return inquiry;
      },

      updateInquiry: (id, data) => {
        set((state) => ({
          inquiries: state.inquiries.map((inq) =>
            inq.id === id
              ? { ...inq, ...data, updatedAt: new Date().toISOString() }
              : inq
          ),
        }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          inquiries: state.inquiries.map((inq) =>
            inq.id === id
              ? { ...inq, status, updatedAt: new Date().toISOString() }
              : inq
          ),
        }));
      },

      deleteInquiry: (id) => {
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
    }),
    {
      name: 'abf-inquiries',
    }
  )
);

export default useInquiryStore;

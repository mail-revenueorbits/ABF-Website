/**
 * Product Data Service
 * Provides data access methods for the product catalog.
 * Now reads from the admin productStore (Zustand + localStorage).
 */

import useProductStore from '../store/productStore';
import useCategoryStore from '../store/categoryStore';

// Simulate a small network delay for realistic loading states
const SIMULATED_DELAY = 200;

function delay(ms = SIMULATED_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to get current products from store
function getProducts() {
  return useProductStore.getState().getPublishedProducts();
}

// Helper to get current categories from store
function getCategoriesData() {
  return useCategoryStore.getState().categories;
}

/**
 * Get all categories, enriched with a live productCount and filtered down
 * to categories that actually contain published products.
 */
export async function getCategories() {
  await delay();
  const categories = getCategoriesData();
  const products = getProducts();
  return categories
    .map((c) => ({
      ...c,
      productCount: products.filter(
        (p) => p.categoryId === c.id || p.category === c.slug
      ).length,
    }))
    .filter((c) => c.productCount > 0);
}

/**
 * Get featured products for the homepage.
 * @param {number} [limit=8] - number of products to return
 */
export async function getFeaturedProducts(limit = 8) {
  await delay();
  const products = getProducts();
  return [...products]
    .filter((p) => p.featured && p.published)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/**
 * Get bestseller products (featured products).
 * @param {number} [limit=4]
 */
export async function getBestsellerProducts(limit = 4) {
  await delay();
  const products = getProducts();
  return [...products]
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/**
 * Get newest products sorted by creation date.
 * @param {number} [limit=4]
 */
export async function getNewArrivals(limit = 4) {
  await delay();
  const products = getProducts();
  return [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

/**
 * Get products that have a salePrice or are on sale.
 * @param {number} [limit=4]
 */
export async function getDealProducts(limit = 4) {
  await delay();
  const products = getProducts();
  return [...products]
    .filter((p) => p.onSale && p.salePrice)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/**
 * Get a single product by ID.
 * @param {string} id
 */
export async function getProductById(id) {
  await delay();
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Get a single product by slug.
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
  await delay();
  const products = getProducts();
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Query products with filtering, sorting, search, and pagination.
 *
 * @param {Object} params
 * @param {string} [params.category] - category slug filter
 * @param {string} [params.search] - search text
 * @param {'price-asc' | 'price-desc' | 'newest' | 'popular'} [params.sort]
 * @param {number} [params.page] - 1-indexed page number
 * @param {number} [params.perPage] - items per page, default 12
 * @returns {Promise<{ products: import('../data/products').Product[], total: number, page: number, totalPages: number }>}
 */
export async function queryProducts({
  category,
  search,
  sort = 'newest',
  page = 1,
  perPage = 12,
} = {}) {
  await delay();

  const products = getProducts();
  let filtered = [...products];

  // Category filter — Shop passes the category slug via URL (?category=sofas).
  // Match against either the slug or the internal cat_* id for flexibility.
  if (category && category !== 'all') {
    filtered = filtered.filter(
      (p) => p.category === category || p.categoryId === category
    );
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'popular':
    default:
      // Primary signal: numeric popularity (admin-tunable, used to elevate
      // owner-selected picks and cleaner-photographed variants). Secondary:
      // the featured flag.
      filtered.sort((a, b) => {
        const diff = (b.popularity || 0) - (a.popularity || 0);
        if (diff !== 0) return diff;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
      break;
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  return {
    products: paged,
    total,
    page: safePage,
    totalPages,
  };
}

/**
 * Get related products (same category, excluding the given product).
 * @param {string} productId
 * @param {number} [limit=4]
 */
export async function getRelatedProducts(productId, limit = 4) {
  await delay();
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/**
 * Get products by an array of IDs (for recently viewed, wishlist, etc.).
 * Preserves the order of the input array.
 * @param {string[]} ids
 */
export async function getProductsByIds(ids) {
  await delay();
  const products = getProducts();
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
}

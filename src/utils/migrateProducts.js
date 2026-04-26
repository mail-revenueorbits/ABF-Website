/**
 * Utility to migrate products from products.js to productStore format
 * Run this once to populate the admin with existing products
 */

import { products as oldProducts } from '../data/products';
import useProductStore from '../store/productStore';

// Map old category slugs to new category IDs
const CATEGORY_MAP = {
  'sofas': 'cat_sofas',
  'chairs': 'cat_office', // generic chairs → office
  'tables': 'cat_dining',
  'storage': 'cat_wardrobe',
  'furnishing': 'cat_curtain',
};

// Map subcategories to more specific category IDs
const SUBCATEGORY_MAP = {
  'Office Chairs': 'cat_office',
  'Gaming Chairs': 'cat_gaming',
  'Rocking Chairs': 'cat_rocking',
  'Dining Tables': 'cat_dining',
  'Tea Tables': 'cat_tea',
  'Bar Units': 'cat_bar',
  'Console Tables': 'cat_console',
  'Wardrobes': 'cat_wardrobe',
  'Curtains': 'cat_curtain',
};

function convertProduct(oldProduct) {
  // Determine category ID
  let categoryId = CATEGORY_MAP[oldProduct.category] || 'cat_sofas';

  // Override with subcategory if more specific
  if (oldProduct.subcategory && SUBCATEGORY_MAP[oldProduct.subcategory]) {
    categoryId = SUBCATEGORY_MAP[oldProduct.subcategory];
  }

  // Convert stock status
  let stockStatus = 'in_stock';
  if (oldProduct.madeToOrder) {
    stockStatus = 'made_to_order';
  } else if (!oldProduct.inStock) {
    stockStatus = 'out_of_stock';
  }

  // Extract dimensions
  const dimensions = {
    height: oldProduct.dimensions?.height || '',
    width: oldProduct.dimensions?.width || '',
    depth: oldProduct.dimensions?.depth || '',
  };

  // Convert description to HTML if needed
  let description = oldProduct.description || '';
  if (!description.startsWith('<')) {
    description = `<p>${description}</p>`;
  }

  // Map tags
  const tags = [];
  if (oldProduct.tag) {
    tags.push(oldProduct.tag.toLowerCase());
  }
  if (oldProduct.material) {
    const materials = oldProduct.material.split(',')[0].toLowerCase();
    if (materials.includes('teak')) tags.push('teak');
    if (materials.includes('sheesham')) tags.push('sheesham');
    if (materials.includes('marble')) tags.push('marble');
  }

  return {
    id: oldProduct.id,
    name: oldProduct.name,
    slug: oldProduct.slug,
    description,
    categoryId,
    price: oldProduct.price,
    salePrice: oldProduct.salePrice || null,
    onSale: !!oldProduct.salePrice,
    images: oldProduct.images || [],
    material: oldProduct.material || '',
    dimensions,
    weight: oldProduct.dimensions?.weight || '',
    colorOptions: oldProduct.variants?.map(v => v.name).join(', ') || '',
    seatingCapacity: oldProduct.seatingCapacity ? String(oldProduct.seatingCapacity) : '',
    warranty: oldProduct.warranty || '',
    careInstructions: oldProduct.careInstructions || '',
    assemblyRequired: false,
    deliveryInfo: oldProduct.deliveryInfo || 'Free delivery inside Kathmandu Valley',
    stockStatus,
    sku: oldProduct.sku || oldProduct.id,
    tags,
    featured: oldProduct.popularity >= 85,
    published: true,
    createdAt: oldProduct.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function migrateAllProducts() {
  const store = useProductStore.getState();

  // Get existing product IDs
  const existingIds = store.products.map(p => p.id);

  // Convert all old products
  const convertedProducts = oldProducts.map(convertProduct);

  // Filter out duplicates (products that already exist)
  const newProducts = convertedProducts.filter(
    p => !existingIds.includes(p.id)
  );

  // Add all new products using the proper store setter
  console.log(`Migrating ${newProducts.length} products...`);

  // Use the store's setState to bulk add products for better performance
  useProductStore.setState((state) => ({
    products: [...newProducts, ...state.products]
  }));

  console.log('Migration complete!');
  return newProducts.length;
}

// Export for manual use in console
if (typeof window !== 'undefined') {
  window.migrateProducts = migrateAllProducts;
}

/**
 * Bulk Migration Script — ABF Website
 * 
 * This script:
 * 1. Reads all product images from /public/products/
 * 2. Uploads each image to Cloudinary
 * 3. Builds a URL mapping (old path → Cloudinary URL)
 * 4. Reads product data from src/data/products.json
 * 5. Replaces image paths with Cloudinary URLs
 * 6. Inserts everything into Supabase (categories, products, banners, blog posts, inquiries)
 * 
 * Usage: node scripts/migrate_to_cloud.cjs
 * 
 * IMPORTANT: Run the SQL schema FIRST in Supabase Dashboard before running this script.
 * IMPORTANT: Temporarily DISABLE RLS on all tables before running this script,
 *            or use the service_role key. After seeding, re-enable RLS.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ─── Configuration ──────────────────────────────────────────────
const SUPABASE_URL = 'https://icwopbuahkucruezlomp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljd29wYnVhaGt1Y3J1ZXpsb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTA2MTcsImV4cCI6MjA5NDI4NjYxN30.YXrzvIExSKzlVNQ2DnZ0desvVTdSbLq93UZp4VBrOSo';
const CLOUDINARY_CLOUD_NAME = 'dtegb4dqz';
const CLOUDINARY_UPLOAD_PRESET = 'ABF-WEBSITE';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'products');
const PRODUCTS_JSON = path.join(__dirname, '..', 'src', 'data', 'products.json');
const MAPPING_OUTPUT = path.join(__dirname, 'cloudinary_mapping.json');

// Concurrency for uploads (Cloudinary free plan allows plenty)
const CONCURRENCY = 5;
// Delay between batches to avoid rate limiting (ms)
const BATCH_DELAY = 500;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Helpers ────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert camelCase key to snake_case.
 */
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert all keys of an object from camelCase to snake_case.
 */
function objToSnake(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
}

/**
 * Upload a single image file to Cloudinary.
 * @param {string} filePath — Absolute path to image file
 * @param {string} folder — Cloudinary folder (e.g. 'abf-website/products/C1-01')
 * @param {string} displayName — Clean display name without slashes
 * @returns {Promise<{ url: string, publicId: string }>}
 */
async function uploadToCloudinary(filePath, folder, displayName) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const mime = mimeMap[ext] || 'image/jpeg';
  const base64 = `data:${mime};base64,${fileBuffer.toString('base64')}`;

  // Generate a unique public_id with the folder baked in
  const fileBaseName = path.basename(filePath, ext);
  const publicId = `${folder}/${fileBaseName}`;

  const body = new URLSearchParams();
  body.append('file', base64);
  body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  body.append('public_id', publicId);
  // Use filename_override (allowed in unsigned uploads) for a clean name
  body.append('filename_override', displayName);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed for ${filePath}: ${errText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}


/**
 * Process a batch of items with limited concurrency.
 */
async function processBatch(items, fn, concurrency = CONCURRENCY) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + concurrency < items.length) {
      await sleep(BATCH_DELAY);
    }
  }
  return results;
}

// ─── Phase 1: Upload images to Cloudinary ──────────────────────

async function uploadAllImages() {
  console.log('\n📸 Phase 1: Uploading images to Cloudinary...\n');

  // Check for existing mapping (resume support)
  if (fs.existsSync(MAPPING_OUTPUT)) {
    console.log('  Found existing mapping file. Loading...');
    const existing = JSON.parse(fs.readFileSync(MAPPING_OUTPUT, 'utf8'));
    console.log(`  Loaded ${Object.keys(existing).length} existing mappings.`);
    return existing;
  }

  const mapping = {};
  
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.log('  No products directory found. Skipping image upload.');
    return mapping;
  }

  // Collect all image files
  const allImages = [];
  const productFolders = fs.readdirSync(PRODUCTS_DIR).filter((f) => {
    const stat = fs.statSync(path.join(PRODUCTS_DIR, f));
    return stat.isDirectory();
  });

  for (const folder of productFolders) {
    const folderPath = path.join(PRODUCTS_DIR, folder);
    const files = fs.readdirSync(folderPath).filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );
    for (const file of files) {
      const baseName = path.basename(file, path.extname(file));
      allImages.push({
        filePath: path.join(folderPath, file),
        relativePath: `/products/${folder}/${file}`,
        cloudinaryFolder: `abf-website/products/${folder}`,
        displayName: `${folder}_${baseName}`,
      });
    }
  }

  console.log(`  Found ${allImages.length} images across ${productFolders.length} product folders.`);
  console.log(`  Uploading with concurrency=${CONCURRENCY}...\n`);

  let uploaded = 0;
  let failed = 0;

  // Upload in batches
  for (let i = 0; i < allImages.length; i += CONCURRENCY) {
    const batch = allImages.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (img) => {
        const result = await uploadToCloudinary(img.filePath, img.cloudinaryFolder, img.displayName);
        mapping[img.relativePath] = result.url;
        return result;
      })
    );

    for (let j = 0; j < results.length; j++) {
      if (results[j].status === 'fulfilled') {
        uploaded++;
      } else {
        failed++;
        console.error(`  ❌ Failed: ${batch[j].relativePath} — ${results[j].reason.message}`);
      }
    }

    const progress = Math.round(((i + batch.length) / allImages.length) * 100);
    process.stdout.write(`\r  Progress: ${uploaded}/${allImages.length} uploaded (${progress}%) | ${failed} failed`);

    if (i + CONCURRENCY < allImages.length) {
      await sleep(BATCH_DELAY);
    }
  }

  console.log(`\n\n  ✅ Upload complete: ${uploaded} uploaded, ${failed} failed.`);

  // Save mapping for resume support
  fs.writeFileSync(MAPPING_OUTPUT, JSON.stringify(mapping, null, 2));
  console.log(`  Mapping saved to ${MAPPING_OUTPUT}`);

  return mapping;
}

// ─── Phase 2: Seed categories ──────────────────────────────────

async function seedCategories() {
  console.log('\n📂 Phase 2: Seeding categories...\n');

  const categories = [
    { id: 'cat_sofas', name: 'Sofas & Sofa Sets', slug: 'sofas', parent_id: null, sort_order: 1 },
    { id: 'cat_dining', name: 'Dining Tables & Sets', slug: 'dining', parent_id: null, sort_order: 2 },
    { id: 'cat_beds', name: 'Beds', slug: 'beds', parent_id: null, sort_order: 3 },
    { id: 'cat_office', name: 'Office Chairs', slug: 'office-chairs', parent_id: null, sort_order: 4 },
    { id: 'cat_gaming', name: 'Gaming Chairs', slug: 'gaming-chairs', parent_id: null, sort_order: 5 },
    { id: 'cat_cafe', name: 'Cafe Chairs', slug: 'cafe-chairs', parent_id: null, sort_order: 6 },
    { id: 'cat_rocking', name: 'Rocking Chairs', slug: 'rocking-chairs', parent_id: null, sort_order: 7 },
    { id: 'cat_bar', name: 'Bar Units & Bar Tables', slug: 'bar-units', parent_id: null, sort_order: 8 },
    { id: 'cat_console', name: 'Console Tables & Sets', slug: 'console-tables', parent_id: null, sort_order: 9 },
    { id: 'cat_dressing', name: 'Dressing Tables', slug: 'dressing-tables', parent_id: null, sort_order: 10 },
    { id: 'cat_side', name: 'Side Tables / Nightstands', slug: 'side-tables', parent_id: null, sort_order: 11 },
    { id: 'cat_tea', name: 'Tea Tables', slug: 'tea-tables', parent_id: null, sort_order: 12 },
    { id: 'cat_wardrobe', name: 'Wardrobes', slug: 'wardrobes', parent_id: null, sort_order: 13 },
    { id: 'cat_ottoman', name: 'Mudas / Ottomans', slug: 'ottomans', parent_id: null, sort_order: 14 },
    { id: 'cat_bench', name: 'Benches', slug: 'benches', parent_id: null, sort_order: 15 },
    { id: 'cat_mirror', name: 'Mirrors', slug: 'mirrors', parent_id: null, sort_order: 16 },
    { id: 'cat_cabinet', name: 'Utility Cabinets', slug: 'cabinets', parent_id: null, sort_order: 17 },
    { id: 'cat_curtain', name: 'Curtains', slug: 'curtains', parent_id: null, sort_order: 18 },
    { id: 'cat_carpet', name: 'Carpets', slug: 'carpets', parent_id: null, sort_order: 19 },
    { id: 'cat_wallpaper', name: 'Wallpapers', slug: 'wallpapers', parent_id: null, sort_order: 20 },
    { id: 'cat_flooring', name: 'Flooring', slug: 'flooring', parent_id: null, sort_order: 21 },
    { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', parent_id: null, sort_order: 22 },
  ];

  const { error } = await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  if (error) {
    console.error('  ❌ Failed to seed categories:', error.message);
    return false;
  }
  console.log(`  ✅ Seeded ${categories.length} categories.`);
  return true;
}

// ─── Phase 3: Seed products ────────────────────────────────────

async function seedProducts(imageMapping) {
  console.log('\n📦 Phase 3: Seeding products...\n');

  if (!fs.existsSync(PRODUCTS_JSON)) {
    console.error('  ❌ products.json not found at', PRODUCTS_JSON);
    return false;
  }

  const rawProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  
  // Deduplicate by ID (keep last occurrence)
  const productMap = new Map();
  for (const p of rawProducts) {
    productMap.set(p.id, p);
  }
  const deduped = Array.from(productMap.values());
  console.log(`  Found ${rawProducts.length} products in JSON (${deduped.length} unique by ID).`);

  // Map image paths to Cloudinary URLs
  // The JSON doesn't have an 'images' array — images are at /products/{id}/1.jpg, /products/{id}/cover.jpg, etc.
  // We build the images array from the Cloudinary mapping.
  const products = deduped.map((p) => {
    // Find all Cloudinary URLs for this product's folder
    const prefix = `/products/${p.id}/`;
    const productImages = Object.entries(imageMapping)
      .filter(([key]) => key.startsWith(prefix))
      .sort(([a], [b]) => a.localeCompare(b)) // sort: 1.jpg, 2.jpg, 3.jpg, cover.jpg
      .map(([, url]) => url);

    // Auto-generate slug if missing: "SOFA SET" + "C1-01" → "sofa-set-c1-01"
    const slug = p.slug || `${(p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${p.id.toLowerCase()}`;

    // Map category names to category IDs
    const categoryMap = {
      'Sofa': 'cat_sofas', 'Dining': 'cat_dining', 'Bed': 'cat_beds',
      'Office Chair': 'cat_office', 'Gaming Chair': 'cat_gaming',
      'Cafe Chair': 'cat_cafe', 'Rocking Chair': 'cat_rocking',
      'Bar': 'cat_bar', 'Console': 'cat_console',
      'Dressing Table': 'cat_dressing', 'Side Table': 'cat_side',
      'Tea Table': 'cat_tea', 'Wardrobe': 'cat_wardrobe',
      'Ottoman': 'cat_ottoman', 'Bench': 'cat_bench',
      'Mirror': 'cat_mirror', 'Cabinet': 'cat_cabinet',
      'Curtain': 'cat_curtain', 'Carpet': 'cat_carpet',
      'Wallpaper': 'cat_wallpaper', 'Flooring': 'cat_flooring',
      'Accessory': 'cat_accessories',
    };
    const categorySlugMap = {
      'Sofa': 'sofas', 'Dining': 'dining', 'Bed': 'beds',
      'Office Chair': 'office-chairs', 'Gaming Chair': 'gaming-chairs',
      'Cafe Chair': 'cafe-chairs', 'Rocking Chair': 'rocking-chairs',
      'Bar': 'bar-units', 'Console': 'console-tables',
      'Dressing Table': 'dressing-tables', 'Side Table': 'side-tables',
      'Tea Table': 'tea-tables', 'Wardrobe': 'wardrobes',
      'Ottoman': 'ottomans', 'Bench': 'benches',
      'Mirror': 'mirrors', 'Cabinet': 'cabinets',
      'Curtain': 'curtains', 'Carpet': 'carpets',
      'Wallpaper': 'wallpapers', 'Flooring': 'flooring',
      'Accessory': 'accessories',
    };

    return {
      id: p.id,
      name: p.name,
      slug,
      sku: p.sku || null,
      description: p.description || null,
      description_html: p.descriptionHtml || null,
      category: categorySlugMap[p.category] || (p.category || '').toLowerCase(),
      subcategory: p.subcategory || null,
      category_id: categoryMap[p.category] || null,
      price: p.price || 0,
      sale_price: p.salePrice || null,
      on_sale: p.onSale || false,
      images: productImages,
      lifestyle_image: productImages[0] || null,
      material: p.material || null,
      dimensions: typeof p.dimensions === 'string' ? { size: p.dimensions } : (p.dimensions || {}),
      weight: p.weight || null,
      seating_capacity: p.seatingCapacity || null,
      color_options: p.colorOptions || null,
      features: p.features || [],
      variants: p.variants || [],
      warranty: p.warranty || null,
      care_instructions: p.careInstructions || null,
      assembly_required: p.assemblyRequired || false,
      delivery_info: p.deliveryInfo || 'Free delivery inside Kathmandu Valley',
      stock_status: p.status === 'Mapped' ? 'in_stock' : (p.stockStatus || 'in_stock'),
      tag: p.tag || null,
      tags: p.tags || [],
      featured: true,
      published: true,
      popularity: p.popularity || 0,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString(),
    };
  });

  // Clear any existing products from previous runs
  console.log('  Clearing existing products...');
  await supabase.from('products').delete().neq('id', '___none___');

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`  ❌ Failed batch ${i}-${i + batch.length}:`, error.message);
      // Log the first problematic product for debugging
      console.error(`     First product in batch: id=${batch[0].id}, slug=${batch[0].slug}`);
    } else {
      inserted += batch.length;
    }
  }
  console.log(`  ✅ Seeded ${inserted}/${products.length} products.`);
  return true;
}

// ─── Phase 4: Seed banners ─────────────────────────────────────

async function seedBanners() {
  console.log('\n🏷️  Phase 4: Seeding banners...\n');

  const banners = [
    {
      id: 'ban_001',
      title: 'Monsoon Sale',
      subtitle: 'Up to 30% off on Sofas & Dining Sets',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&auto=format',
      link_url: '/shop?category=sofas',
      link_text: 'Shop Now',
      position: 'hero',
      active: true,
      sort_order: 1,
      start_date: null,
      end_date: null,
      created_at: '2026-04-20T10:00:00Z',
    },
    {
      id: 'ban_002',
      title: 'Free Delivery Inside Kathmandu Valley',
      subtitle: '',
      image_url: '',
      link_url: '',
      link_text: '',
      position: 'promo_bar',
      active: true,
      sort_order: 1,
      start_date: null,
      end_date: null,
      created_at: '2026-04-20T10:00:00Z',
    },
  ];

  const { error } = await supabase.from('banners').upsert(banners, { onConflict: 'id' });
  if (error) {
    console.error('  ❌ Failed to seed banners:', error.message);
    return false;
  }
  console.log(`  ✅ Seeded ${banners.length} banners.`);
  return true;
}

// ─── Phase 5: Seed blog posts ──────────────────────────────────

async function seedBlogPosts() {
  console.log('\n📝 Phase 5: Seeding blog posts...\n');

  const posts = [
    {
      id: 'blog_001',
      title: 'How to Choose the Perfect Sofa for Your Living Room',
      slug: 'how-to-choose-perfect-sofa',
      excerpt: 'A comprehensive guide to selecting the right sofa size, material, and style for Nepali homes.',
      content: '<h2>Finding Your Ideal Sofa</h2><p>Choosing the right sofa is one of the most important furniture decisions you will make.</p>',
      cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format',
      author: 'AB Furniture Team',
      tags: JSON.stringify(['sofas', 'guide', 'living room']),
      published: true,
      created_at: '2026-04-22T10:00:00Z',
      updated_at: '2026-04-22T10:00:00Z',
    },
  ];

  const { error } = await supabase.from('blog_posts').upsert(posts, { onConflict: 'id' });
  if (error) {
    console.error('  ❌ Failed to seed blog posts:', error.message);
    return false;
  }
  console.log(`  ✅ Seeded ${posts.length} blog posts.`);
  return true;
}

// ─── Phase 6: Seed inquiries ───────────────────────────────────

async function seedInquiries() {
  console.log('\n📬 Phase 6: Seeding sample inquiries...\n');

  const inquiries = [
    {
      id: 'inq_001',
      name: 'Ramesh Sharma',
      phone: '+977 984-1234567',
      email: 'ramesh@gmail.com',
      product_of_interest: 'Royal Sofa Set',
      budget_range: 'Rs. 3,00,000 - Rs. 5,00,000',
      preferred_contact: 'whatsapp',
      message: 'I am interested in the Royal Sofa Set. Can you share more photos and available color options?',
      delivery_location: 'Lalitpur, Kathmandu Valley',
      status: 'new',
      notes: '',
      created_at: '2026-04-25T08:30:00Z',
      updated_at: '2026-04-25T08:30:00Z',
    },
    {
      id: 'inq_002',
      name: 'Sunita Patel',
      phone: '+977 980-9876543',
      email: 'sunita.patel@yahoo.com',
      product_of_interest: 'Marble Top Dining Set',
      budget_range: 'Rs. 1,50,000 - Rs. 2,00,000',
      preferred_contact: 'phone',
      message: 'We are furnishing our new home. Need a dining set for 8 people.',
      delivery_location: 'Baneshwor, Kathmandu',
      status: 'replied',
      notes: 'Called back. Scheduled showroom visit for April 27.',
      created_at: '2026-04-24T14:15:00Z',
      updated_at: '2026-04-25T09:00:00Z',
    },
    {
      id: 'inq_003',
      name: 'Anil KC',
      phone: '+977 986-5551234',
      email: 'anil.kc@hotmail.com',
      product_of_interest: 'Office Chairs',
      budget_range: 'Rs. 50,000 - Rs. 1,00,000',
      preferred_contact: 'whatsapp',
      message: 'We need 5 ergonomic office chairs for our new office. Do you offer bulk discounts?',
      delivery_location: 'Thamel, Kathmandu',
      status: 'closed',
      notes: 'Ordered 5 chairs. Delivered on April 23.',
      created_at: '2026-04-20T11:00:00Z',
      updated_at: '2026-04-23T16:00:00Z',
    },
  ];

  const { error } = await supabase.from('inquiries').upsert(inquiries, { onConflict: 'id' });
  if (error) {
    console.error('  ❌ Failed to seed inquiries:', error.message);
    return false;
  }
  console.log(`  ✅ Seeded ${inquiries.length} inquiries.`);
  return true;
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log(' ABF Website — Cloud Migration Script');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\n  Supabase: ${SUPABASE_URL}`);
  console.log(`  Cloudinary: ${CLOUDINARY_CLOUD_NAME}`);

  try {
    // Test Supabase connection
    const { error: testError } = await supabase.from('categories').select('id').limit(1);
    if (testError) {
      console.error('\n❌ Cannot connect to Supabase. Have you run the SQL schema?');
      console.error('   Error:', testError.message);
      console.error('\n   1. Go to Supabase Dashboard → SQL Editor');
      console.error('   2. Paste the contents of scripts/supabase_schema.sql');
      console.error('   3. Run the query');
      console.error('   4. TEMPORARILY disable RLS on all tables (enable after seeding)');
      console.error('   5. Re-run this script\n');
      process.exit(1);
    }
    console.log('  Supabase connection: ✅\n');

    // Phase 1: Upload images
    const imageMapping = await uploadAllImages();
    console.log(`\n  Total mappings: ${Object.keys(imageMapping).length}`);

    // Phase 2-6: Seed data
    await seedCategories();
    await seedProducts(imageMapping);
    await seedBanners();
    await seedBlogPosts();
    await seedInquiries();

    console.log('\n═══════════════════════════════════════════════════');
    console.log(' ✅ Migration complete!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n  Next steps:');
    console.log('  1. Verify data in Supabase Dashboard → Table Editor');
    console.log('  2. Re-enable RLS if you disabled it');
    console.log('  3. Create an admin user in Supabase Auth → Users → Add User');
    console.log('  4. You can now safely remove /public/products/ if desired\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

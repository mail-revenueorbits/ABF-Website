-- =========================================================
-- ABF Website — Supabase Database Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- =========================================================

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  description TEXT,
  description_html TEXT,
  category TEXT,
  subcategory TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price INTEGER NOT NULL DEFAULT 0,
  sale_price INTEGER,
  on_sale BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  lifestyle_image TEXT,
  material TEXT,
  dimensions JSONB DEFAULT '{}'::jsonb,
  weight TEXT,
  seating_capacity TEXT,
  color_options TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  care_instructions TEXT,
  assembly_required BOOLEAN DEFAULT false,
  delivery_info TEXT DEFAULT 'Free delivery inside Kathmandu Valley',
  stock_status TEXT DEFAULT 'in_stock',
  tag TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  link_text TEXT,
  position TEXT DEFAULT 'hero',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'AB Furniture Team',
  tags JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INQUIRIES
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  product_of_interest TEXT,
  budget_range TEXT,
  preferred_contact TEXT DEFAULT 'whatsapp',
  message TEXT,
  delivery_location TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES for common queries
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- =========================================================
-- DONE! Now run the migration script to seed data:
--   node scripts/migrate_to_cloud.cjs
--
-- After seeding, run scripts/supabase_rls.sql to enable
-- Row Level Security policies.
-- =========================================================

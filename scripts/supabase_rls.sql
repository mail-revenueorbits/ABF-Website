-- =========================================================
-- ABF Website — Row Level Security Policies
-- Run this AFTER seeding data with migrate_to_cloud.cjs
-- Supabase Dashboard → SQL Editor → New Query
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ─── PUBLIC READ policies ───────────────────────────────
-- (anon key can read published/active content)

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read published products" ON products
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read active banners" ON banners
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Public can submit inquiries (contact form)
CREATE POLICY "Public can submit inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- ─── ADMIN (authenticated) policies ─────────────────────
-- Full CRUD for logged-in admin users

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access banners" ON banners
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

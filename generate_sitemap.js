import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Fetching published products from Supabase...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('published', true);

  if (error) {
    console.error('Error fetching products:', error.message);
    process.exit(1);
  }

  console.log(`Found ${products.length} published products.`);

  const domain = 'https://abfurniturenepal.com';
  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Homepage
  xml += '  <url>\n';
  xml += `    <loc>${domain}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>daily</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // 2. Shop Page
  xml += '  <url>\n';
  xml += `    <loc>${domain}/shop</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  xml += '  </url>\n';

  // 3. Gaming Chair Landing Page
  xml += '  <url>\n';
  xml += `    <loc>${domain}/promo/gaming-chair</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';

  // 4. Dynamic Products
  for (const product of products) {
    const lastMod = product.updated_at 
      ? new Date(product.updated_at).toISOString().split('T')[0] 
      : currentDate;
    
    xml += '  <url>\n';
    xml += `    <loc>${domain}/product/${product.id}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  console.log(`Success! Sitemap successfully written to ${sitemapPath}`);
}

generateSitemap();

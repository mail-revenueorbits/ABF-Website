import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chairsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'chairs_and_bars_export.json'), 'utf8'));

// Format currency
function formatNPR(amount) {
  if (!amount) return 'Price on Request';
  return 'Rs. ' + Number(amount).toLocaleString('en-IN');
}

// Clean HTML tags and entities
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanDimensionValue(val) {
  if (!val) return '';
  return val
    .replace(/back\s*rest\s*height\s*[-:]?\s*/gi, '')
    .replace(/back\s*height\s*[-:]?\s*/gi, '')
    .replace(/seat\s*width\s*[-:]?\s*/gi, '')
    .replace(/seat\s*depth\s*[-:]?\s*/gi, '')
    .replace(/saet\s*depth\s*[-:]?\s*/gi, '')
    .replace(/inch(es)?/gi, '″')
    .trim();
}

// Map color codes to friendly swatch display names and colors
function parseColorOptions(colorStr) {
  if (!colorStr) return [];
  const rawColors = colorStr.split(/[,/]+/).map(s => s.trim().replace(/^v/i, '')).filter(Boolean);
  const colorMap = {
    'D.GREY': { name: 'Dark Grey', hex: '#4A4846' },
    'L.GREY': { name: 'Light Grey', hex: '#C2BEB8' },
    'MAROON': { name: 'Deep Maroon', hex: '#78232C' },
    'D.BLUE': { name: 'Navy Blue', hex: '#263B54' },
    'AQUA': { name: 'Aqua Mist', hex: '#6398AD' },
    'CREAM': { name: 'Warm Cream', hex: '#EBE3D3' },
    'D.BROWN': { name: 'Espresso Brown', hex: '#423226' },
    'L.BROWN': { name: 'Caramel Tan', hex: '#A87954' },
    'L.PINK': { name: 'Blush Pink', hex: '#DFA3B1' },
    'PINK': { name: 'Rose Pink', hex: '#D6899B' },
  };

  const seen = new Set();
  const parsed = [];
  for (const c of rawColors) {
    const upper = c.toUpperCase();
    if (!seen.has(upper) && upper) {
      seen.add(upper);
      const info = colorMap[upper] || { name: c, hex: '#8C8276' };
      parsed.push(info);
    }
  }
  return parsed;
}

const productEnhancements = [
  {
    id: "prod_1787141693671",
    catalogTitle: "Maroon Channelled Velvet Chair",
    modelCode: "ABF-CC01",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Vertical channel stitching with curved armrests and tapered matte black metal legs.",
  },
  {
    id: "prod_1787141441447",
    catalogTitle: "Light Grey Curved Velvet Chair",
    modelCode: "ABF-CC02",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Sculptural barrel backrest with deep high-resilience foam cushioning.",
  },
  {
    id: "prod_1787141789104",
    catalogTitle: "Royal Blue Channelled Chair",
    modelCode: "ABF-CC03",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Ergonomic curved arm support with plush sapphire velvet and heavy gauge metal frame.",
  },
  {
    id: "prod_1787141337981",
    catalogTitle: "Cream Curved Velvet Chair",
    modelCode: "ABF-CC04",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Minimalist rounded back in warm ivory velvet with natural timber-finish metal legs.",
  },
  {
    id: "prod_1787141391808",
    catalogTitle: "Caramel Brown Curved Velvet Chair",
    modelCode: "ABF-CC05",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Rich mocha brown velvet dining chair with wraparound backrest and stable base.",
  },
  {
    id: "prod_1787140890839",
    catalogTitle: "Classic White Sheesham Wood Chair",
    modelCode: "ABF-CC06",
    categoryLabel: "Solid Wood Craftsmanship",
    highlight: "Solid Sheesham hardwood construction with padded curved back and customizable polish.",
  },
  {
    id: "prod_1787140935982",
    catalogTitle: "Contemporary Solid Wood Chair",
    modelCode: "ABF-CC07",
    categoryLabel: "Solid Wood Craftsmanship",
    highlight: "Architectural wooden frame with durable commercial upholstery for high-traffic dining.",
  },
  {
    id: "prod_1787141058943",
    catalogTitle: "Sapphire Blue Channelled Chair",
    modelCode: "ABF-CC08",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Vibrant sapphire blue upholstery with tailored channel stitching and reinforced steel base.",
  },
  {
    id: "prod_1787141095439",
    catalogTitle: "Blush Pink Scallop Crown Chair",
    modelCode: "ABF-CC09",
    categoryLabel: "Statement Accent & Dining",
    highlight: "Signature fluted crown backrest with lustrous brass-finished metal legs.",
  },
  {
    id: "prod_1787141138247",
    catalogTitle: "Aqua Blue Scallop Crown Chair",
    modelCode: "ABF-CC10",
    categoryLabel: "Statement Accent & Dining",
    highlight: "Fluted seashell backrest in pastel aqua velvet with gold-tipped tapered legs.",
  },
  {
    id: "prod_1787141190088",
    catalogTitle: "Dusty Rose Keyhole Velvet Chair",
    modelCode: "ABF-CC11",
    categoryLabel: "Mid-Century Modern Seating",
    highlight: "Mid-century keyhole cutout backrest with natural timber-finish tapered legs.",
  },
  {
    id: "prod_1787141257920",
    catalogTitle: "Warm Brown Keyhole Velvet Chair",
    modelCode: "ABF-CC12",
    categoryLabel: "Mid-Century Modern Seating",
    highlight: "Sculpted ergonomic keyhole backrest in warm caramel velvet with solid reinforced legs.",
  },
  {
    id: "prod_1787141487631",
    catalogTitle: "Slate Grey Channelled Velvet Chair",
    modelCode: "ABF-CC13",
    categoryLabel: "Commercial Dining & Cafe",
    highlight: "Neutral slate grey upholstered chair with ergonomic contours and powder-coated legs.",
  },
  {
    id: "prod_1787141898729",
    catalogTitle: "Bar Chair",
    modelCode: "ABF-BC01 / BROWN",
    categoryLabel: "High-Counter & Bar Seating",
    highlight: "Ergonomic high-back bar chair with footrest support and durable commercial frame.",
  },
  {
    id: "prod_1787141954104",
    catalogTitle: "Bar Chair",
    modelCode: "ABF-BC02 / GREY",
    categoryLabel: "High-Counter & Bar Seating",
    highlight: "Sculptural high-back counter seating with footrest in light grey velvet upholstery.",
  }
];

const assetsDir = path.join(__dirname, 'catalog_assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function optimizeImage(url, filename) {
  const localPath = path.join(assetsDir, filename);
  if (fs.existsSync(localPath) && fs.statSync(localPath).size > 1000) {
    return localPath;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    await sharp(buffer)
      .resize(850, 850, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(localPath);

    return localPath;
  } catch (err) {
    console.warn(`Could not optimize ${url}: ${err.message}`);
    return url;
  }
}

async function prepareAllData() {
  console.log('Loading & compressing 15 catalog items...');
  const preparedItems = [];

  for (let i = 0; i < chairsRaw.length; i++) {
    const c = chairsRaw[i];
    const enh = productEnhancements.find(e => e.id === c.id) || {
      catalogTitle: c.name || `Seating ${i + 1}`,
      modelCode: c.sku ? `ABF-${c.sku}` : `ABF-CH${String(i + 1).padStart(2, '0')}`,
      categoryLabel: "Commercial & Dining Seating",
      highlight: "Handcrafted commercial and dining chair by AB Furniture Kathmandu.",
    };
    const dims = typeof c.dimensions === 'string' ? JSON.parse(c.dimensions || '{}') : (c.dimensions || {});
    const rawImages = typeof c.images === 'string' ? JSON.parse(c.images || '[]') : (c.images || []);
    const colors = parseColorOptions(c.color_options);

    const localImages = [];
    for (let imgIdx = 0; imgIdx < rawImages.length; imgIdx++) {
      const imgUrl = rawImages[imgIdx];
      const filename = `item_${i + 1}_img_${imgIdx + 1}.jpg`;
      const optPath = await optimizeImage(imgUrl, filename);
      const base64 = fs.existsSync(optPath) 
        ? `data:image/jpeg;base64,${fs.readFileSync(optPath).toString('base64')}`
        : imgUrl;
      localImages.push(base64);
    }

    preparedItems.push({
      ...c,
      ...enh,
      dims,
      images: localImages,
      colors,
      cleanDesc: cleanText(c.description),
    });
  }

  return preparedItems;
}

function generateHTML(items) {
  const totalCount = items.length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AB Furniture — Cafe & Bar Chair Collection 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --terracotta: #C04A1E;
      --terracotta-dark: #9E3710;
      --espresso: #26211E;
      --walnut: #4A3A2F;
      --clay: #7A6D62;
      --sandstone: #A89C8F;
      --paper: #F8F5EF;
      --paper-pure: #FFFFFF;
      --border-light: rgba(74, 58, 47, 0.12);
      --border-subtle: rgba(74, 58, 47, 0.06);
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #E8E3DA;
      color: var(--espresso);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .catalog-page {
      width: 210mm;
      height: 297mm;
      margin: 20px auto;
      background: var(--paper);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 36px rgba(40, 30, 20, 0.08);
      page-break-after: always;
      page-break-inside: avoid;
    }
    @media print {
      body {
        background: none;
      }
      .catalog-page {
        margin: 0;
        box-shadow: none;
        width: 210mm;
        height: 297mm;
      }
    }

    /* ══════════════════════════════════════════════════
       COVER PAGE
       ══════════════════════════════════════════════════ */
    .cover-page {
      padding: 24mm 22mm 20mm;
      background: #F4EFE6;
      justify-content: space-between;
    }
    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1.5px solid var(--border-light);
      padding-bottom: 16px;
    }
    .cover-brand {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--espresso);
    }
    .cover-brand-sub {
      font-size: 9.5px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--terracotta);
      margin-top: 4px;
      font-weight: 700;
    }
    .cover-badge {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 14px;
      border: 1px solid var(--border-light);
      background: #FFFFFF;
      border-radius: 20px;
      font-weight: 600;
      color: var(--walnut);
    }

    .cover-center {
      margin: 10mm 0 6mm;
    }
    .cover-tag {
      display: inline-block;
      color: var(--terracotta);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .cover-headline {
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: -0.01em;
      margin-bottom: 16px;
      color: var(--espresso);
    }
    .cover-headline em {
      font-style: italic;
      color: var(--terracotta);
      font-family: 'Playfair Display', serif;
    }
    .cover-subtext {
      font-size: 13.5px;
      line-height: 1.7;
      color: var(--clay);
      max-width: 520px;
      font-weight: 400;
    }

    .cover-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin: 6mm 0 4mm;
    }
    .cover-thumb {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      box-shadow: 0 4px 12px rgba(40, 30, 20, 0.04);
    }
    .cover-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-footer {
      border-top: 1.5px solid var(--border-light);
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--clay);
    }
    .cover-footer strong {
      color: var(--espresso);
      display: block;
      margin-bottom: 3px;
      font-size: 10.5px;
      letter-spacing: 0.05em;
    }

    /* ══════════════════════════════════════════════════
       PRODUCT PAGES
       ══════════════════════════════════════════════════ */
    .product-page {
      padding: 18mm 20mm 16mm;
      justify-content: space-between;
    }

    /* Top Bar */
    .p-topbar {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1.5px solid var(--border-light);
      padding-bottom: 12px;
    }
    .p-brand-group {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .p-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--espresso);
    }
    .p-brand-cat {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--terracotta);
    }
    .p-folio-num {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: var(--walnut);
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      padding: 3px 12px;
      border-radius: 20px;
    }

    /* Hero Visual Dual-Stage */
    .p-visual-stage {
      display: grid;
      grid-template-columns: 104mm 60mm;
      gap: 6mm;
      align-items: stretch;
      margin: 14px 0 16px;
    }
    .p-hero-img-box {
      height: 110mm;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(40, 30, 20, 0.04);
    }
    .p-hero-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .p-side-img-col {
      display: flex;
      flex-direction: column;
      gap: 6mm;
    }
    .p-side-img-box {
      height: 74mm;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-light);
      box-shadow: 0 4px 16px rgba(40, 30, 20, 0.04);
    }
    .p-side-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .p-side-badge-card {
      flex: 1;
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 3px;
    }
    .p-badge-status {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #2D6A4F;
    }
    .p-badge-code {
      font-size: 11px;
      font-weight: 700;
      color: var(--espresso);
      letter-spacing: 0.05em;
    }
    .p-badge-note {
      font-size: 9px;
      color: var(--clay);
    }

    /* Identity, Title & Pricing */
    .p-identity-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 12px;
    }
    .p-title-area {
      max-width: 110mm;
    }
    .p-cat-label {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--terracotta);
      margin-bottom: 4px;
    }
    .p-chair-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 600;
      line-height: 1.12;
      color: var(--espresso);
      margin-bottom: 6px;
    }
    .p-chair-tagline {
      font-size: 11.5px;
      color: var(--walnut);
      line-height: 1.45;
      font-weight: 400;
    }
    .p-price-area {
      text-align: right;
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 10px 16px;
      min-width: 50mm;
      box-shadow: 0 2px 8px rgba(40, 30, 20, 0.03);
    }
    .p-price-title {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--clay);
      font-weight: 600;
      display: block;
    }
    .p-price-num {
      font-size: 22px;
      font-weight: 700;
      color: var(--terracotta);
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
      margin-top: 2px;
    }
    .p-price-sub {
      font-size: 8.5px;
      color: var(--clay);
      display: block;
      margin-top: 2px;
    }

    /* 4-Column Technical Specification Matrix */
    .p-specs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }
    .p-spec-block {
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 10px 12px;
    }
    .p-spec-kicker {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--clay);
      margin-bottom: 4px;
    }
    .p-spec-val {
      font-size: 11px;
      font-weight: 700;
      color: var(--espresso);
      line-height: 1.3;
    }
    .p-spec-subval {
      font-size: 9.5px;
      color: var(--walnut);
      margin-top: 2px;
      font-weight: 400;
    }

    /* Narrative & Color Swatches */
    .p-bottom-row {
      display: grid;
      grid-template-columns: 105mm 1fr;
      gap: 12px;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 10px 16px;
      margin-bottom: 10px;
    }
    .p-desc-text {
      font-size: 10px;
      line-height: 1.5;
      color: var(--walnut);
    }
    .p-swatches-wrap {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .p-swatches-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--clay);
    }
    .p-swatch-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .p-swatch-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--paper);
      border: 1px solid var(--border-light);
      padding: 2.5px 8px 2.5px 4px;
      border-radius: 20px;
      font-size: 9px;
      font-weight: 600;
      color: var(--espresso);
    }
    .p-swatch-circle {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.15);
    }

    /* Footer Trust & Inquiry Bar */
    .p-footer {
      border-top: 1.5px solid var(--border-light);
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: var(--clay);
    }
    .p-footer-trust {
      display: flex;
      gap: 14px;
    }
    .p-trust-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--walnut);
      font-weight: 600;
    }
    .p-trust-dot {
      width: 4px;
      height: 4px;
      background: var(--terracotta);
      border-radius: 50%;
    }
    .p-footer-order {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--walnut);
      font-weight: 600;
    }
    .p-footer-order strong {
      color: var(--terracotta);
      font-size: 10.5px;
    }

    /* ══════════════════════════════════════════════════
       BACK COVER
       ══════════════════════════════════════════════════ */
    .back-page {
      padding: 22mm 22mm 20mm;
      background: #F4EFE6;
      justify-content: space-between;
    }
    .back-top {
      border-bottom: 1.5px solid var(--border-light);
      padding-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back-hero {
      margin: 8mm 0;
    }
    .back-headline {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 400;
      line-height: 1.15;
      color: var(--espresso);
      margin-bottom: 14px;
    }
    .back-subhead {
      font-size: 13.5px;
      color: var(--clay);
      line-height: 1.65;
      max-width: 520px;
      margin-bottom: 22px;
      font-weight: 400;
    }
    .back-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 22px;
    }
    .back-info-card {
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 16px 18px;
      box-shadow: 0 4px 12px rgba(40, 30, 20, 0.03);
    }
    .back-card-kicker {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--terracotta);
      margin-bottom: 6px;
    }
    .back-card-body {
      font-size: 11.5px;
      line-height: 1.55;
      color: var(--walnut);
    }
    .back-cta-banner {
      background: #FFFFFF;
      border: 1.5px solid var(--terracotta);
      border-radius: 8px;
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .back-cta-text h4 {
      font-family: 'Playfair Display', serif;
      font-size: 17px;
      color: var(--espresso);
      margin-bottom: 3px;
    }
    .back-cta-text p {
      font-size: 11px;
      color: var(--clay);
    }
    .back-cta-btn {
      background: var(--terracotta);
      color: #FFFFFF;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .back-bottom-bar {
      border-top: 1.5px solid var(--border-light);
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--clay);
    }
    .back-bottom-bar strong {
      color: var(--espresso);
    }
  </style>
</head>
<body>

  <!-- ══════════════════════════════════════════════════
       PAGE 1: COVER PAGE
       ══════════════════════════════════════════════════ -->
  <section class="catalog-page cover-page">
    <div class="cover-top">
      <div>
        <h1 class="cover-brand">AB FURNITURE & FURNISHING</h1>
        <p class="cover-brand-sub">KATHMANDU, NEPAL &bull; EST. 2004</p>
      </div>
      <div class="cover-badge">CATALOG 2026</div>
    </div>

    <div class="cover-center">
      <span class="cover-tag">Commercial & Hospitality Seating</span>
      <h2 class="cover-headline">The <em>Cafe & Bar Chair</em><br>Collection</h2>
      <p class="cover-subtext">
        Curated commercial-grade dining, cafe, and bar counter chairs handcrafted with heavy-duty metal bases, Sheesham wood frames, and premium velvet upholstery. Designed for Kathmandu’s leading cafes, restaurants, lounges, bars, and contemporary dining rooms.
      </p>
    </div>

    <div class="cover-strip">
      ${items.slice(0, 4).map(c => `
        <div class="cover-thumb">
          <img src="${c.images[0]}" alt="${c.catalogTitle}">
        </div>
      `).join('')}
    </div>

    <div class="cover-footer">
      <div>
        <strong>SHOWROOM & WORKSHOP</strong>
        <span>Gyaneshwor, Kathmandu (Opp. German Bakery)</span>
      </div>
      <div>
        <strong>DIRECT ORDERS & WHATSAPP</strong>
        <span>+977 9818421463 &bull; +977 9841234567</span>
      </div>
      <div>
        <strong>DIGITAL SHOWROOM</strong>
        <span>www.abfurniturenepal.com</span>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════
       15 PRODUCT PAGES (1 PER CHAIR / BAR CHAIR)
       ══════════════════════════════════════════════════ -->
  ${items.map((chair, index) => {
    const pageNum = String(index + 1).padStart(2, '0');
    const mainImg = chair.images[0] || '/products/_placeholder.jpg';
    const sideImg = chair.images[1] || mainImg;
    
    const rawHeight = cleanDimensionValue(chair.dims.height);
    const rawWidth = cleanDimensionValue(chair.dims.width);
    const rawDepth = cleanDimensionValue(chair.dims.depth);
    
    const heightDisplay = rawHeight ? `${rawHeight} Back Height` : (chair.name === 'BAR CHAIR' ? '48″ Back Height' : '36″ Back Height');
    const seatDisplay = (rawWidth && rawDepth) ? `${rawWidth} W &times; ${rawDepth} D` : '18″ W &times; 17.5″ D';
    const frameMaterial = chair.material ? chair.material.toUpperCase() : 'HEAVY GAUGE STEEL';

    return `
    <section class="catalog-page product-page">
      <!-- Top Folio Bar -->
      <div class="p-topbar">
        <div class="p-brand-group">
          <span class="p-brand-name">AB FURNITURE</span>
          <span class="p-brand-cat">&bull; ${chair.name === 'BAR CHAIR' ? 'BAR & COUNTER SEATING' : 'CAFE & COMMERCIAL SEATING'}</span>
        </div>
        <div class="p-folio-num">ITEM ${pageNum} // ${String(totalCount).padStart(2, '0')}</div>
      </div>

      <!-- Hero Visual Dual-Stage -->
      <div class="p-visual-stage">
        <div class="p-hero-img-box">
          <img src="${mainImg}" alt="${chair.catalogTitle} — Studio Hero">
        </div>
        <div class="p-side-img-col">
          <div class="p-side-img-box">
            <img src="${sideImg}" alt="${chair.catalogTitle} — In-Situ Context">
          </div>
          <div class="p-side-badge-card">
            <div class="p-badge-status">&bull; ${chair.stock_status === 'in_stock' ? 'In Stock & Ready' : 'Made to Order'}</div>
            <div class="p-badge-code">${chair.modelCode}</div>
            <div class="p-badge-note">Kathmandu Workshop Craft</div>
          </div>
        </div>
      </div>

      <!-- Identity, Model Name & Prominent Price -->
      <div class="p-identity-row">
        <div class="p-title-area">
          <div class="p-cat-label">${chair.categoryLabel}</div>
          <h2 class="p-chair-title">${chair.catalogTitle}</h2>
          <p class="p-chair-tagline">${chair.highlight}</p>
        </div>
        <div class="p-price-area">
          <span class="p-price-title">DIRECT PRICE (MRP)</span>
          <div class="p-price-num">${formatNPR(chair.price)}</div>
          <span class="p-price-sub">All Taxes & KTM Delivery Included</span>
        </div>
      </div>

      <!-- 4-Column Technical Specification Matrix -->
      <div class="p-specs-grid">
        <div class="p-spec-block">
          <div class="p-spec-kicker">Frame & Base</div>
          <div class="p-spec-val">${frameMaterial}</div>
          <div class="p-spec-subval">${chair.name === 'BAR CHAIR' ? 'Reinforced bar height base' : 'Reinforced commercial grade'}</div>
        </div>
        <div class="p-spec-block">
          <div class="p-spec-kicker">Backrest Height</div>
          <div class="p-spec-val">${heightDisplay}</div>
          <div class="p-spec-subval">Ergonomic spine support</div>
        </div>
        <div class="p-spec-block">
          <div class="p-spec-kicker">Seat Dimensions</div>
          <div class="p-spec-val">${seatDisplay}</div>
          <div class="p-spec-subval">High-resilience foam cushion</div>
        </div>
        <div class="p-spec-block">
          <div class="p-spec-kicker">Warranty & Delivery</div>
          <div class="p-spec-val">Structural Warranty</div>
          <div class="p-spec-subval">Free KTM White-Glove Dispatch</div>
        </div>
      </div>

      <!-- Narrative & Color Swatch Selection -->
      <div class="p-bottom-row">
        <p class="p-desc-text">
          ${chair.cleanDesc || "Handcrafted commercial-grade seating designed for durability, comfort, and timeless aesthetic appeal. Suitable for cafes, restaurants, bars, hospitality venues, and modern residential spaces."}
        </p>
        <div class="p-swatches-wrap">
          <div class="p-swatches-title">Available Fabric Finishes</div>
          <div class="p-swatch-list">
            ${chair.colors.length > 0 ? chair.colors.map(col => `
              <div class="p-swatch-chip">
                <span class="p-swatch-circle" style="background-color: ${col.hex};"></span>
                <span>${col.name}</span>
              </div>
            `).join('') : `
              <div class="p-swatch-chip">
                <span class="p-swatch-circle" style="background-color: #8B4513;"></span>
                <span>Custom Finishes Available</span>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Bottom Trust & WhatsApp Order Bar -->
      <div class="p-footer">
        <div class="p-footer-trust">
          <div class="p-trust-item"><span class="p-trust-dot"></span> 20 Years Kathmandu Heritage</div>
          <div class="p-trust-item"><span class="p-trust-dot"></span> Custom Upholstery on Request</div>
          <div class="p-trust-item"><span class="p-trust-dot"></span> Tiered Bulk Pricing</div>
        </div>
        <div class="p-footer-order">
          <span>Order / Inquire via WhatsApp:</span>
          <strong>+977 9818421463</strong>
        </div>
      </div>
    </section>
    `;
  }).join('')}

  <!-- ══════════════════════════════════════════════════
       BACK COVER
       ══════════════════════════════════════════════════ -->
  <section class="catalog-page back-page">
    <div class="back-top">
      <div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 18px; color: var(--espresso);">AB FURNITURE & FURNISHING</h2>
        <p style="font-size: 9.5px; color: var(--terracotta); letter-spacing: 0.2em; text-transform: uppercase;">KATHMANDU VALLEY, NEPAL</p>
      </div>
      <div style="font-size: 10px; color: var(--walnut); border: 1px solid var(--border-light); background: #FFFFFF; padding: 4px 12px; border-radius: 20px;">
        COMMERCIAL & BULK ORDERS
      </div>
    </div>

    <div class="back-hero">
      <h3 class="back-headline">Bespoke Hospitality &<br>Commercial Solutions</h3>
      <p class="back-subhead">
        Furnishing a new cafe, restaurant, lounge, bar, or commercial space? AB Furniture provides complete turnkey manufacturing, custom color matching, and volume pricing with direct factory delivery across Nepal.
      </p>

      <div class="back-cards-grid">
        <div class="back-info-card">
          <div class="back-card-kicker">Custom Upholstery & Branding</div>
          <p class="back-card-body">
            Choose from over 50+ commercial-grade velvet, leatherette, and linen fabrics with spill-resistant treatments tailored to your interior theme.
          </p>
        </div>
        <div class="back-info-card">
          <div class="back-card-kicker">Direct Workshop Pricing</div>
          <p class="back-card-body">
            No middleman markups. Direct manufacturer pricing with special tiered discounts for bulk orders of 10+ chairs.
          </p>
        </div>
        <div class="back-info-card">
          <div class="back-card-kicker">Free KTM Valley Delivery</div>
          <p class="back-card-body">
            Complimentary white-glove delivery, unboxing, and placement inside Kathmandu Valley. Reliable nationwide logistics across Nepal.
          </p>
        </div>
        <div class="back-info-card">
          <div class="back-card-kicker">20 Years of Proven Trust</div>
          <p class="back-card-body">
            Established in 2004 in Gyaneshwor, Kathmandu. Over 2,500+ satisfied residential and commercial clients across Nepal.
          </p>
        </div>
      </div>

      <div class="back-cta-banner">
        <div class="back-cta-text">
          <h4>Ready to Order or Request a Sample?</h4>
          <p>Send us your floor plan or chair quantity for an instant commercial quote.</p>
        </div>
        <div class="back-cta-btn">
          WhatsApp: +977 9818421463
        </div>
      </div>
    </div>

    <div class="back-bottom-bar">
      <div>
        <strong>Showroom:</strong> Gyaneshwor, Kathmandu (Opposite German Bakery)
      </div>
      <div>
        <strong>Website:</strong> www.abfurniturenepal.com
      </div>
      <div>
        <strong>Catalog:</strong> ABF-SEATING-2026 &bull; All Rights Reserved
      </div>
    </div>
  </section>

</body>
</html>`;
}

async function main() {
  const items = await prepareAllData();
  const htmlContent = generateHTML(items);
  const htmlPath = path.join(__dirname, '..', 'ABF_Cafe_Chairs_Catalog.html');
  fs.writeFileSync(htmlPath, htmlContent);
  console.log('HTML written at:', htmlPath);

  const pdfPath = path.join(__dirname, '..', 'ABF_Cafe_Chairs_Catalog.pdf');
  console.log('Generating 17-page PDF (15 products + Cover + Back)...');

  const possibleBrowsers = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  let browserPath = possibleBrowsers.find(p => fs.existsSync(p));

  if (!browserPath) {
    console.error('No compatible browser found to print PDF.');
    process.exit(1);
  }

  const command = `"${browserPath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  execSync(command);

  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`\n✅ 15-PRODUCT CATALOG PDF CREATED SUCCESSFULLY!`);
    console.log(`File: ${pdfPath}`);
    console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.error('❌ Failed to create PDF file.');
  }
}

main().catch(console.error);

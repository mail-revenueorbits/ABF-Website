const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'raw_products.json');
const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// High-converting templates based on product type
const templates = {
    'sofa': (name, mat, feats) => `Make a bold, luxurious statement with the exquisite ${name}. Crafted carefully to transform your living room into a sanctuary of comfort and style, this piece radiates contemporary elegance. Built over a premium ${mat || 'solid wood'} frame, the deep, high-resilience seating provides a cloud-like lounging experience. Whether you're hosting guests or enjoying a quiet evening, it is designed to be the breathtaking centerpiece of any modern home.`,
    
    'chair': (name, mat, feats) => `Experience supreme comfort and unparalleled support with our premium ${name}. Whether for an office setup or a modern dining space, this chair is engineered with a focus on ergonomics and posture support. Featuring a highly durable ${mat || 'premium'} build and a sleek, minimalist aesthetic, it seamlessly blends functionality with high-end design to keep you comfortable all day long.`,
    
    'curtain': (name, mat, feats) => `Elevate your home decor instantly with our luxurious ${name}. Woven from the finest ${mat || 'premium quality'} fabrics, these curtains offer a rich, elegant drape that completely transforms the ambiance of any room. Not only do they provide exceptional privacy and ideal light filtration, but their durable, soft-touch material ensures lasting beauty and a warm, inviting atmosphere in your sanctuary.`,
    
    'bed': (name, mat, feats) => `Transform your bedroom into a royal retreat with the magnificent ${name}. Constructed from incredibly sturdy ${mat || 'high-quality wood'}, this bed frame is a testament to timeless luxury and exceptional craftsmanship. The sleek, modern finish perfectly highlights the natural elegance of the materials, ensuring long-lasting stability, zero-noise nights, and a majestic centerpiece for your resting space.`,
    
    'table': (name, mat, feats) => `Dine, work, and gather around the stunning ${name}. Meticulously designed with a premium ${mat || 'solid wood'} base, this table merges robust durability with a highly sophisticated silhouette. Its smooth, beautifully finished top provides an immaculate surface that resists daily wear while adding an unmistakable touch of modern luxury to your living or dining area.`,
    
    'default': (name, mat, feats) => `Discover the perfect blend of utility and exquisite design with our ${name}. Crafted from high-grade ${mat || 'materials'}, it promises outstanding durability and a sleek, contemporary look. Thoughtfully engineered to meet your everyday needs while elevating your interior decor, this is a true investment in premium living.`
};

function getCategory(name) {
    const lower = name.toLowerCase();
    if (lower.includes('sofa') || lower.includes('corner set')) return 'sofa';
    if (lower.includes('chair') || lower.includes('muda')) return 'chair';
    if (lower.includes('parda') || lower.includes('curtain')) return 'curtain';
    if (lower.includes('bed')) return 'bed';
    if (lower.includes('table') || lower.includes('dinning') || lower.includes('desk') || lower.includes('console')) return 'table';
    return 'default';
}

const finalProducts = rawData.map(prod => {
    const cat = getCategory(prod.name);
    const desc = templates[cat](prod.name, prod.material, prod.raw_details);
    
    // Clean up features
    let features = [];
    if (prod.raw_details) {
        features = prod.raw_details
            .split(/\n|-|\*/)
            .map(s => s.trim())
            .filter(s => s.length > 3);
    }
    
    // De-duplicate features
    features = [...new Set(features)];
    
    return {
        id: prod.id,
        campaign: prod.campaign,
        name: prod.name,
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        price: prod.price,
        material: prod.material || 'Premium Material',
        dimensions: prod.dimensions || 'Standard',
        description: desc,
        features: features
    };
});

// Output as JSON (best format for React/Next.js agents)
const outputPath = path.join(__dirname, 'ABF_Final_Products.json');
fs.writeFileSync(outputPath, JSON.stringify(finalProducts, null, 2));

console.log(`Successfully processed ${finalProducts.length} products and saved to ABF_Final_Products.json`);

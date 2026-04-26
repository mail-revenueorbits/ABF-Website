const fs = require('fs');
const path = require('path');

// Read existing mapped products
const rawData = fs.readFileSync('ABF_Final_Products.json', 'utf8');
let products = JSON.parse(rawData);

// Utility to generate a professional description based on name/category
function generateDescription(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('sofa')) {
        return `Make a bold, luxurious statement with the exquisite ${name}. Crafted carefully to transform your living room into a sanctuary of comfort and style, this piece radiates contemporary elegance. Built over a premium solid wood frame, the deep, high-resilience seating provides a cloud-like lounging experience. Whether you're hosting guests or enjoying a quiet evening, it is designed to be the breathtaking centerpiece of any modern home.`;
    } else if (lowerName.includes('chair')) {
        return `Experience superior comfort and refined design with the ${name}. Ergonomically engineered to provide exceptional support, this chair is as functional as it is stylish. The premium upholstery and sturdy base ensure durability while maintaining a sleek, professional profile. Perfect for elevating your home office or commercial workspace with a touch of modern sophistication.`;
    } else if (lowerName.includes('dining')) {
        return `Create unforgettable memories around the ${name}. This stunning dining centerpiece perfectly balances aesthetic brilliance with practical durability. The meticulously finished surface and robust construction provide a stable, spacious area for lavish dinners or casual family meals. Its timeless design seamlessly integrates with various interior themes, making it a proud addition to your home.`;
    } else if (lowerName.includes('bed')) {
        return `Transform your bedroom into a restful oasis with the ${name}. Designed with both aesthetics and structural integrity in mind, this piece offers an impeccable foundation for a good night's sleep. Its elegant headboard and polished finish bring a serene, sophisticated ambiance to your personal space. Wake up refreshed and inspired every morning.`;
    } else if (lowerName.includes('curtain')) {
        return `Enhance your interior decor with the elegant ${name}. These high-quality drapes offer the perfect blend of privacy, light control, and aesthetic appeal. Woven from premium fabrics, they drape beautifully to add texture and warmth to any room. Instantly elevate the ambiance of your living room, bedroom, or office with this stylish window treatment.`;
    } else if (lowerName.includes('table')) {
        return `Introduce a blend of utility and charm with the ${name}. Characterized by its sleek design and superior craftsmanship, this piece is a versatile addition to any room. Whether serving as a focal point or a functional accent, the durable tabletop and sturdy frame guarantee lasting beauty. It's the perfect companion for your decor, offering both style and convenience.`;
    } else {
        return `Discover the exceptional craftsmanship of the ${name}. Designed to blend seamlessly into your lifestyle, this premium piece offers outstanding durability and timeless appeal. Carefully constructed using high-quality materials, it promises to enhance your living space with its unique character and practical functionality. An essential addition to elevate your modern home decor.`;
    }
}

// 1. C1 Name Corrections
const nameCorrections = {
    'C1-14': 'Executive Boss Chair',
    'C2-09': 'Marble Top Accent Table',
    'C2-14': 'Oval Marble Top Table',
    'C4-03': 'Floating Wall Shelf',
    'C4-04': 'Floating Wall Shelf (Style 2)',
    'C4-05': 'Floating Wall Shelf (Style 3)',
    'C4-06': 'Floating Wall Shelf (Style 4)',
    'C4-08': 'Corner Shelf Unit',
    'C4-10': 'Dressing Console Table',
    'C4-25': 'Vanity Dressing Table (Gold)',
    'C5-06': 'Glass-Top Coffee Table',
    'C5-07': 'Laptop Bed Tray',
    'C5-13': 'Display Cabinet / Bookshelf',
    'C5-18': 'Luggage Rack / Shoe Bench',
    'C5-21': 'Bedside Nightstand',
    'C5-22': 'Bedside Nightstand',
    'C5-25': 'RGB Gaming Table'
};

products.forEach(p => {
    if (nameCorrections[p.id]) {
        p.name = nameCorrections[p.id];
        p.description = generateDescription(p.name);
    }
});

// 2. Add New Products
const newProducts = [
    {
        id: "C1-20",
        campaign: "C1",
        name: "Patternized Curtains",
        category: "Curtain",
        price: 2499,
        material: "Premium Fabric",
        dimensions: "Standard",
        description: generateDescription("Patternized Curtains"),
        features: ["MULTI-TONED", "STRIPED DESIGN", "MAROON/BROWN/CREAM"],
        image_folder: "Campaign 1/photos/20 - patternized curtains",
        status: "Mapped"
    },
    {
        id: "C2-16",
        campaign: "C2",
        name: "Wooden Bar Stool Chair",
        category: "Chair",
        price: 4999,
        material: "Solid Wood",
        dimensions: "Standard",
        description: generateDescription("Wooden Bar Stool Chair"),
        features: ["ROUND CUSHIONED SEAT", "CURVED WOODEN LEGS", "BAR STOOL"],
        image_folder: "Campaign 2/photos/16 - Cafe CHair",
        status: "Mapped"
    },
    {
        id: "C3-23",
        campaign: "C3",
        name: "Premium Curtain Variant",
        category: "Curtain",
        price: 2999,
        material: "Premium Fabric",
        dimensions: "Standard",
        description: generateDescription("Premium Curtain Variant"),
        features: ["PREMIUM FABRIC", "ELEGANT DESIGN"],
        image_folder: "Campaign 3/photos/Curtains 17",
        status: "Mapped"
    },
    {
        id: "C5-11",
        campaign: "C5",
        name: "Round-Top Z-Base Side Table",
        category: "Table",
        price: 3499,
        material: "Wood",
        dimensions: "Standard",
        description: generateDescription("Round-Top Z-Base Side Table"),
        features: ["ROUND TOP", "Z-SHAPED BASE", "CANTILEVER DESIGN"],
        image_folder: "Campaign 5/photos/P11 - Cafe Table",
        status: "Mapped"
    }
];

// Combine existing and new products
let finalProducts = [...products, ...newProducts];

// 3. Remove C5 empty sofas (no images/no descriptions)
const removeIds = ['C5-26', 'C5-28', 'C5-29', 'C5-30'];
finalProducts = finalProducts.filter(p => !removeIds.includes(p.id));

// 4. Handle C1 Numbering Shift
// IDs C1-20 to C1-25 in original JSON need to become C1-21 to C1-26 and image folder shifted
// Note: they are already named C1-20, C1-21 in existing, let's shift them
finalProducts.forEach(p => {
    if (p.campaign === 'C1') {
        const numMatch = p.id.match(/C1-(\d+)/);
        if (numMatch) {
            const num = parseInt(numMatch[1], 10);
            if (num >= 20 && p.name !== "Patternized Curtains") {
                // If it's an original product with num >= 20
                // Let's manually map folders for the shifted ones based on audit
                if (num === 20) { p.id = "C1-21"; p.image_folder = "Campaign 1/photos/21 - round galaichaa"; }
                else if (num === 21) { p.id = "C1-22"; p.image_folder = "Campaign 1/photos/22 - white galaichha"; }
                else if (num === 22) { p.id = "C1-23"; p.image_folder = "Campaign 1/photos/23 - red galaichaa"; }
                else if (num === 23) { p.id = "C1-24"; p.image_folder = "Campaign 1/photos/24 - white galaichaa 2"; }
                else if (num === 24) { p.id = "C1-25"; p.image_folder = "Campaign 1/photos/25 - royal sofa"; }
                else if (num === 25) { p.id = "C1-26"; p.image_folder = "Campaign 1/photos/26"; }
            }
        }
    }
});

// Sort products by campaign and ID
finalProducts.sort((a, b) => {
    if (a.campaign !== b.campaign) {
        return a.campaign.localeCompare(b.campaign);
    }
    const numA = parseInt(a.id.split('-')[1]);
    const numB = parseInt(b.id.split('-')[1]);
    return numA - numB;
});

// Create src/data directory if it doesn't exist
const outputDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write to final JSON
const outputPath = path.join(outputDir, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(finalProducts, null, 2), 'utf8');

console.log(`Successfully finalized ${finalProducts.length} products to ${outputPath}`);

const fs = require('fs');
const path = require('path');

const baseDir = "g:/My Drive/Arcchive/AB Furnitures";
const jsonPath = path.join(__dirname, 'ABF_Final_Products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const campaignFolders = {
    'C1': 'Campaign 1/photos',
    'C2': 'Campaign 2/Photoshoot',
    'C3': 'Campaign 3/Sorted Photos',
    'C4': 'Campaign 4/Sotred Assets',
    'C5': 'Campaign 5/Sorted Assets'
};

const imageMappings = {};
const unmappedImages = [];

for (const [camp, folder] of Object.entries(campaignFolders)) {
    const fullPath = path.join(baseDir, folder);
    if (!fs.existsSync(fullPath)) continue;
    
    const dirs = fs.readdirSync(fullPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
        
    for (const d of dirs) {
        let matchedSn = null;
        
        if (camp === 'C1' || camp === 'C2') {
            const match = d.match(/^(\d+)/);
            if (match) matchedSn = match[1];
        } else if (camp === 'C4' || camp === 'C5') {
            const match = d.match(/^P(\d+)/i);
            if (match) matchedSn = match[1];
        } else if (camp === 'C3') {
            if (d.toLowerCase().startsWith('bed')) {
                const match = d.match(/bed\s*(\d+)/i);
                if (match) matchedSn = match[1];
            } else if (d.toLowerCase().startsWith('curtain')) {
                const match = d.match(/curtain[s]?\s*(\d+)/i);
                if (match) matchedSn = String(parseInt(match[1]) + 6); // Curtains start at SN 7 in C3
            }
        }
        
        if (matchedSn) {
            const paddedSn = String(matchedSn).padStart(2, '0');
            const id = `${camp}-${paddedSn}`;
            imageMappings[id] = path.join(folder, d).replace(/\\/g, '/');
        } else {
            unmappedImages.push(`${camp}: ${d}`);
        }
    }
}

let missingImagesCount = 0;
let missingDetailsCount = 0;

for (const prod of products) {
    if (imageMappings[prod.id]) {
        prod.image_folder = imageMappings[prod.id];
        prod.status = "Mapped";
        delete imageMappings[prod.id];
    } else {
        prod.image_folder = null;
        prod.status = "Missing Image";
        missingImagesCount++;
    }
}

// Any remaining in imageMappings are images without CSV details
for (const [id, folder] of Object.entries(imageMappings)) {
    products.push({
        id: id,
        campaign: id.split('-')[0],
        name: "Unknown Product",
        category: "Unknown",
        price: 0,
        description: "Image folder exists but missing CSV product details.",
        features: [],
        image_folder: folder,
        status: "Missing Details"
    });
    missingDetailsCount++;
}

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));

console.log(`Mapped successfully. Missing Images: ${missingImagesCount}. Missing Details: ${missingDetailsCount}. Unmapped Folders: ${unmappedImages.length}`);

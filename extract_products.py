import csv
import json
import os
import re

def clean_price(price_str):
    if not price_str:
        return 0
    # Extract only digits
    digits = re.sub(r'[^\d]', '', str(price_str))
    return int(digits) if digits else 0

def clean_text(text):
    if not text:
        return ""
    return str(text).strip()

base_dir = r"g:\My Drive\Arcchive\AB Furnitures\Product Details"
files = {
    "C1": "C1 Product Description.csv",
    "C2": "C2 Product Description.csv",
    "C3": "C3 Product Description.csv",
    "C4": "ABF - C4 Product Description - Sheet1.csv",
    "C5": "ABF - C5 Product Description - Sheet1.csv"
}

products = []
unique_types = {}

def add_product(item):
    products.append(item)
    # create a unique signature based on name and raw details to deduplicate for rewriting
    sig = f"{item['name'].lower()}_{item['raw_details'].lower()}"
    if sig not in unique_types:
        unique_types[sig] = {
            "name": item['name'],
            "material": item.get('material', ''),
            "raw_details": item['raw_details'],
            "count": 1
        }
    else:
        unique_types[sig]["count"] += 1

# Process C1
with open(os.path.join(base_dir, files["C1"]), 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sn = row.get('SN', '').strip()
        if not sn or not sn.isdigit(): continue
        name = clean_text(row.get('Product Name', ''))
        price = clean_price(row.get('Selling Price (MRP)', ''))
        f1 = clean_text(row.get('Key Features (in points)', ''))
        f2 = clean_text(row.get('Other details about the products', ''))
        raw_details = f"{f1}\n{f2}".strip()
        add_product({
            "id": f"C1-{sn.zfill(2)}",
            "campaign": "C1",
            "name": name,
            "price": price,
            "raw_details": raw_details
        })

# Process C2
with open(os.path.join(base_dir, files["C2"]), 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    for row in reader:
        if len(row) < 6: continue
        sn = str(row[0]).strip()
        if not sn or not sn.isdigit(): continue
        name = clean_text(row[2]).replace('-', '').strip()
        details = clean_text(row[3])
        price = clean_price(row[5]) if clean_price(row[5]) > 0 else clean_price(row[4])
        
        add_product({
            "id": f"C2-{sn.zfill(2)}",
            "campaign": "C2",
            "name": name,
            "price": price,
            "raw_details": details
        })

# Process C3
with open(os.path.join(base_dir, files["C3"]), 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    for row in reader:
        if len(row) < 7: continue
        sn = str(row[0]).strip()
        if not sn or not sn.isdigit(): continue
        name = clean_text(row[2]).replace('-', '').strip()
        material = clean_text(row[3])
        price = clean_price(row[4])
        dim = clean_text(row[5])
        details = clean_text(row[6])
        
        add_product({
            "id": f"C3-{sn.zfill(2)}",
            "campaign": "C3",
            "name": name,
            "material": material,
            "dimensions": dim,
            "price": price,
            "raw_details": details
        })

# Process C4
with open(os.path.join(base_dir, files["C4"]), 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    for row in reader:
        if len(row) < 7: continue
        sn = str(row[0]).strip()
        if not sn or not sn.isdigit(): continue
        name = clean_text(row[2])
        material = clean_text(row[3])
        price = clean_price(row[4])
        dim = clean_text(row[5])
        details = clean_text(row[6])
        
        add_product({
            "id": f"C4-{sn.zfill(2)}",
            "campaign": "C4",
            "name": name,
            "material": material,
            "dimensions": dim,
            "price": price,
            "raw_details": details
        })

# Process C5
with open(os.path.join(base_dir, files["C5"]), 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    for row in reader:
        if len(row) < 7: continue
        sn = str(row[0]).strip()
        if not sn or not sn.isdigit(): continue
        name = clean_text(row[2])
        material = clean_text(row[3])
        price = clean_price(row[4])
        dim = clean_text(row[5])
        details = clean_text(row[6])
        
        add_product({
            "id": f"C5-{sn.zfill(2)}",
            "campaign": "C5",
            "name": name,
            "material": material,
            "dimensions": dim,
            "price": price,
            "raw_details": details
        })

output_dir = r"c:\Users\Acer\Documents\React Apps\ABF-Website"
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(output_dir, 'raw_products.json'), 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

unique_list = list(unique_types.values())
with open(os.path.join(output_dir, 'unique_product_types.json'), 'w', encoding='utf-8') as f:
    json.dump(unique_list, f, indent=2)

print(f"Total products processed: {len(products)}")
print(f"Total unique product types found: {len(unique_list)}")

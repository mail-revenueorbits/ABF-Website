import os
from PIL import Image
import json

base_dir = r"g:\My Drive\Arcchive\AB Furnitures"
output_dir = r"c:\Users\Acer\Documents\React Apps\ABF-Website\proxies"
os.makedirs(output_dir, exist_ok=True)

# We will just scan Campaign 1 to Campaign 5
for i in range(1, 6):
    campaign_folder = os.path.join(base_dir, f"Campaign {i}", "photos")
    if not os.path.exists(campaign_folder):
        continue
    
    for item_dir in os.listdir(campaign_folder):
        item_path = os.path.join(campaign_folder, item_dir)
        if not os.path.isdir(item_path):
            continue
            
        # find first image in item_dir or its subdirectories
        img_file = None
        for root, dirs, files in os.walk(item_path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    img_file = os.path.join(root, file)
                    break
            if img_file:
                break
                
        if img_file:
            try:
                with Image.open(img_file) as img:
                    img.thumbnail((400, 400), Image.LANCZOS)
                    out_name = f"C{i}_{item_dir[:2] if item_dir[:2].isdigit() else item_dir}.jpg"
                    img.convert('RGB').save(os.path.join(output_dir, out_name), quality=80)
            except Exception as e:
                print(f"Error processing {img_file}: {e}")

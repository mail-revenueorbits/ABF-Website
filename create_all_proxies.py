import os
from PIL import Image

base_dir = r"g:\My Drive\Arcchive\AB Furnitures"
output_dir = r"c:\Users\Acer\Documents\React Apps\ABF-Website\proxies"
os.makedirs(output_dir, exist_ok=True)

campaigns = {
    "C2": "Campaign 2/Photoshoot",
    "C3": "Campaign 3/Sorted Photos",
    "C4": "Campaign 4/Sotred Assets",
    "C5": "Campaign 5/Sorted Assets"
}

for camp, folder in campaigns.items():
    full_path = os.path.join(base_dir, folder)
    if not os.path.exists(full_path):
        print(f"SKIP: {full_path} not found")
        continue
    
    for item_dir in sorted(os.listdir(full_path)):
        item_path = os.path.join(full_path, item_dir)
        if not os.path.isdir(item_path):
            continue
        
        # Find first image
        img_file = None
        for root, dirs, files in os.walk(item_path):
            for file in sorted(files):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    img_file = os.path.join(root, file)
                    break
            if img_file:
                break
        
        if img_file:
            # Extract folder number
            num = ""
            name = item_dir
            if camp in ("C4", "C5"):
                # P1, P2, etc
                parts = item_dir.split(" - ", 1)
                num = parts[0].replace("P", "")
            elif camp == "C2":
                parts = item_dir.split(" - ", 1)
                num = parts[0]
            elif camp == "C3":
                if "Bed" in item_dir:
                    num = "Bed" + item_dir.replace("Bed ", "").strip()
                elif "urtain" in item_dir:
                    num = "Cur" + item_dir.replace("CUrtains ", "").replace("Curtains ", "").strip()
                else:
                    num = item_dir
            
            out_name = f"{camp}_{num}.jpg"
            out_path = os.path.join(output_dir, out_name)
            
            if os.path.exists(out_path):
                continue
            
            try:
                with Image.open(img_file) as img:
                    img.thumbnail((500, 500), Image.LANCZOS)
                    img.convert('RGB').save(out_path, quality=85)
                    print(f"OK: {out_name}")
            except Exception as e:
                print(f"ERR: {out_name} - {e}")

print("DONE")

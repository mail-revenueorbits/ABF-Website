"""
Build 4:5 ratio product images from the AB Furniture campaign folders.

Reads src/data/products.json, walks each product's image_folder, center-crops
(or letterboxes as needed) source images to 4:5, and writes up to 3 images
per product into public/products/<ID>/1.jpg, 2.jpg, 3.jpg.

The first image is also saved as cover.jpg (for card/list thumbnails).

Run: python scripts/build_product_images.py
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageOps

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
CAMPAIGN_ROOT = Path(r"g:/My Drive/Arcchive/AB Furnitures")
PRODUCTS_JSON = ROOT / "src" / "data" / "products.json"
OUTPUT_DIR = ROOT / "public" / "products"

# Target ratio: 4:5 (portrait). Output 1000x1250.
TARGET_W = 1000
TARGET_H = 1250
MAX_PER_PRODUCT = 3
JPEG_QUALITY = 78

VALID_EXT = {".png", ".jpg", ".jpeg", ".webp"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def find_source_images(folder: Path) -> list[Path]:
    """Return an ordered list of source images for a product folder.

    Prefers an ``Edited/`` subfolder if it exists, otherwise falls back to
    the top-level folder. Skips ``desktop.ini`` and other non-images.
    """
    if not folder.exists():
        return []

    candidates: list[Path] = []

    edited = folder / "Edited"
    if edited.is_dir():
        candidates.extend(sorted(p for p in edited.iterdir()
                                 if p.suffix.lower() in VALID_EXT))

    # Also include top-level (some campaigns don't have Edited/).
    if not candidates:
        candidates.extend(sorted(p for p in folder.iterdir()
                                 if p.is_file() and p.suffix.lower() in VALID_EXT))

    # Last resort: recurse one more level (some products nest deeper).
    if not candidates:
        for p in sorted(folder.rglob("*")):
            if p.is_file() and p.suffix.lower() in VALID_EXT:
                candidates.append(p)
                if len(candidates) >= MAX_PER_PRODUCT:
                    break

    return candidates[:MAX_PER_PRODUCT]


# Warm off-white backdrop for cut-out product shots. Matches the
# --color-ivory-200 token used by the product cards in the UI so
# a cut-out image and its card container read as one surface.
BACKDROP = (245, 240, 232)


def flatten_transparent(img: Image.Image) -> Image.Image:
    """Composite any transparency (PNG alpha, palette transparency, LA mode)
    over BACKDROP. Without this, `.convert("RGB")` fills transparent pixels
    with BLACK, which is what was showing up on cut-out product photos."""
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, BACKDROP + (255,))
        bg.alpha_composite(rgba)
        return bg.convert("RGB")
    return img.convert("RGB")


def to_4_5(img: Image.Image) -> Image.Image:
    """Flatten any transparency, center-crop to 4:5, resize to target size."""
    img = flatten_transparent(img)
    src_w, src_h = img.size
    target_ratio = TARGET_W / TARGET_H  # 0.8
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # Source is wider → crop horizontally.
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, src_h))
    else:
        # Source is taller (or equal) → crop vertically.
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        img = img.crop((0, top, src_w, top + new_h))

    return img.resize((TARGET_W, TARGET_H), Image.LANCZOS)


def process_product(pid: str, image_folder_rel: str) -> tuple[int, list[str]]:
    """Process one product; return (count_generated, relative_urls)."""
    src_folder = CAMPAIGN_ROOT / image_folder_rel
    sources = find_source_images(src_folder)
    if not sources:
        return 0, []

    out_dir = OUTPUT_DIR / pid
    out_dir.mkdir(parents=True, exist_ok=True)

    urls: list[str] = []
    for idx, src in enumerate(sources, start=1):
        out_path = out_dir / f"{idx}.jpg"
        if out_path.exists() and out_path.stat().st_size > 0:
            urls.append(f"/products/{pid}/{idx}.jpg")
            continue
        try:
            with Image.open(src) as im:
                cropped = to_4_5(im)
                cropped.save(out_path, format="JPEG",
                             quality=JPEG_QUALITY, optimize=True,
                             progressive=True)
            urls.append(f"/products/{pid}/{idx}.jpg")
        except Exception as e:
            print(f"  ! failed {src.name}: {e}", file=sys.stderr)

    # Mirror first image as cover.jpg for easier linking.
    if urls:
        cover = out_dir / "cover.jpg"
        first = out_dir / "1.jpg"
        if first.exists() and (not cover.exists() or
                               cover.stat().st_mtime < first.stat().st_mtime):
            shutil.copyfile(first, cover)

    return len(urls), urls


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> int:
    with open(PRODUCTS_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    # Dedupe by id. Prefer: (a) entry whose image_folder actually exists,
    # then (b) entry with a real (non-"Unknown") name.
    def score(p: dict) -> tuple[int, int]:
        folder = p.get("image_folder") or ""
        folder_exists = 1 if folder and (CAMPAIGN_ROOT / folder).exists() else 0
        name = (p.get("name") or "").strip()
        named = 0 if (not name) or name.lower() == "unknown product" else 1
        return (folder_exists, named)

    by_id: dict[str, dict] = {}
    for p in products:
        pid = p["id"]
        existing = by_id.get(pid)
        if existing is None or score(p) > score(existing):
            by_id[pid] = p

    print(f"Processing {len(by_id)} unique products "
          f"(from {len(products)} raw entries)")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    summary: dict[str, list[str]] = {}
    missing: list[str] = []
    for pid, p in by_id.items():
        folder = p.get("image_folder")
        if not folder:
            missing.append(pid)
            continue
        count, urls = process_product(pid, folder)
        if count == 0:
            missing.append(pid)
            print(f"  skip {pid}: no source images in {folder}")
        else:
            summary[pid] = urls
            print(f"  ok   {pid}: {count} img(s) from {folder}")

    # Write manifest so the Node step can embed stable URLs.
    manifest = ROOT / "scripts" / "product_image_manifest.json"
    manifest.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\nDone.")
    print(f"  products with images : {len(summary)}")
    print(f"  products missing     : {len(missing)}")
    if missing:
        print(f"  missing ids          : {', '.join(missing)}")
    print(f"  manifest written     : {manifest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

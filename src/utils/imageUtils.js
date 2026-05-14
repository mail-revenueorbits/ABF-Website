/**
 * Convert a File object to a data-URL string for local preview.
 * In production this would upload to a CDN/storage bucket.
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress and resize an image file using Canvas.
 * Returns a compressed data-URL.
 */
export async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.7 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP (best compression) with fallback to JPEG
        // We use a slightly lower quality for the data-URL to keep localStorage usage down
        const compressedDataUrl = canvas.toDataURL('image/webp', quality);
        
        // If webp is larger than original or not supported, fallback to jpeg
        if (compressedDataUrl.length > event.target.result.length && file.type === 'image/jpeg') {
          resolve(event.target.result);
        } else {
          resolve(compressedDataUrl);
        }
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Validate image file type.
 * Size limit removed — we crop and compress before upload.
 * Returns { valid, error? }
 */
export function validateImage(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'File must be JPEG, PNG, WebP, or AVIF.' };
  }
  return { valid: true };
}

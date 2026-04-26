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
 * Validate image file type and size.
 * Returns { valid, error? }
 */
export function validateImage(file, maxSizeMB = 5) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'File must be JPEG, PNG, WebP, or AVIF.' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File must be under ${maxSizeMB}MB.` };
  }
  return { valid: true };
}

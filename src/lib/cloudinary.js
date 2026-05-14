/**
 * Cloudinary image upload service.
 * Uses unsigned upload preset for direct browser-to-Cloudinary uploads.
 * No SDK needed — just fetch to keep the bundle small.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a compressed image file or data-URL to Cloudinary.
 * @param {File|Blob|string} fileOrDataUrl — File/Blob object or a base64 data-URL string
 * @param {Object} [options]
 * @param {string} [options.folder] — Cloudinary folder path (e.g. 'abf-website/products')
 * @param {function} [options.onProgress] — Progress callback (0-100)
 * @returns {Promise<{ url: string, publicId: string, width: number, height: number }>}
 */
export async function uploadImage(fileOrDataUrl, { folder = 'abf-website', onProgress } = {}) {
  const formData = new FormData();

  if (typeof fileOrDataUrl === 'string') {
    // It's a data-URL — send as-is (Cloudinary accepts base64 data URIs)
    formData.append('file', fileOrDataUrl);
  } else {
    formData.append('file', fileOrDataUrl);
  }

  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  // Use XMLHttpRequest for progress tracking if callback provided
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
          });
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Cloudinary upload failed: network error'));
      xhr.send(formData);
    });
  }

  // Simple fetch for uploads without progress tracking
  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

/**
 * Generate a Cloudinary delivery URL with transformations.
 * Useful for generating thumbnails on-the-fly.
 * @param {string} publicIdOrUrl — Cloudinary public ID or full URL
 * @param {Object} transforms — e.g. { width: 400, height: 400, crop: 'fill', quality: 'auto', format: 'auto' }
 * @returns {string} Transformed URL
 */
export function getTransformedUrl(publicIdOrUrl, transforms = {}) {
  // If it's already a full Cloudinary URL, insert transforms
  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    const parts = publicIdOrUrl.split('/upload/');
    if (parts.length === 2) {
      const transformStr = Object.entries(transforms)
        .map(([k, v]) => {
          const keyMap = { width: 'w', height: 'h', crop: 'c', quality: 'q', format: 'f' };
          return `${keyMap[k] || k}_${v}`;
        })
        .join(',');
      return `${parts[0]}/upload/${transformStr}/${parts[1]}`;
    }
  }

  // Build URL from public ID
  const transformStr = Object.entries(transforms)
    .map(([k, v]) => {
      const keyMap = { width: 'w', height: 'h', crop: 'c', quality: 'q', format: 'f' };
      return `${keyMap[k] || k}_${v}`;
    })
    .join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${publicIdOrUrl}`;
}

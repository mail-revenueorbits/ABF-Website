import React, { useRef, useCallback } from 'react';
import { fileToDataUrl, validateImage } from '../../utils/imageUtils';

/**
 * Multi-image uploader with drag/drop and preview.
 * Props: images (string[]), onChange (fn), maxImages (number)
 */
function ImageUploader({ images = [], onChange, maxImages = 8 }) {
  const inputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    const newImages = [...images];
    for (const file of files) {
      if (newImages.length >= maxImages) break;
      const validation = validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      newImages.push(dataUrl);
    }
    onChange(newImages);
  }, [images, onChange, maxImages]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback((index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }, [images, onChange]);

  return (
    <div>
      <div
        className="admin-image-upload"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <span className="material-symbols-outlined">cloud_upload</span>
        <p>Click or drag images here</p>
        <p style={{ fontSize: '11px', marginTop: '4px' }}>
          JPEG, PNG, WebP up to 5MB each. {images.length}/{maxImages} uploaded.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      </div>

      {images.length > 0 && (
        <div className="admin-image-preview-grid">
          {images.map((src, i) => (
            <div key={i} className="admin-image-preview">
              <img src={src} alt={`Upload ${i + 1}`} />
              <button
                type="button"
                className="admin-image-preview-remove"
                onClick={() => handleRemove(i)}
                title="Remove image"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;

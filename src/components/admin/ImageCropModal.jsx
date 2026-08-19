import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCropModal.css';

/**
 * Crops an image given the source URL and crop pixel area.
 * Returns a data-URL of the cropped square image.
 */
function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      // Output a fixed 1200×1200 square for consistent quality
      const outputSize = Math.min(1200, Math.max(pixelCrop.width, pixelCrop.height));
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize,
        outputSize
      );

      resolve(canvas.toDataURL('image/webp', 0.85));
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}

/**
 * Modal for cropping images to a 1:1 square ratio.
 * Shows one image at a time from the queue.
 *
 * Props:
 *   imageQueue: string[] — data-URLs of images awaiting crop
 *   onCropComplete: (croppedDataUrl: string) => void — called after each crop
 *   onSkip: () => void — skip cropping this image
 *   onCancel: () => void — cancel the entire batch
 *   currentIndex: number — which image in the queue we're on
 *   totalCount: number — total images in the batch
 */
function ImageCropModal({ imageSrc, onCropComplete, onCancel, currentIndex, totalCount }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => setCrop(crop), []);
  const onZoomChange = useCallback((zoom) => setZoom(zoom), []);

  const onCropAreaComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Called by react-easy-crop when the image's natural dimensions are known.
   * We compute the minimum zoom so the entire image fits inside the 1:1 crop area.
   */
  const onMediaLoaded = useCallback((mediaSize) => {
    const { naturalWidth, naturalHeight } = mediaSize;
    // For a 1:1 crop with objectFit="contain", react-easy-crop scales the image
    // so the longer side fits the container. We want to allow zooming out enough
    // that the full image is visible. The library handles this via minZoom prop.
    // A safe minimum: ratio of shorter side / longer side (ensures full coverage).
    const computedMin = Math.min(naturalWidth, naturalHeight) / Math.max(naturalWidth, naturalHeight);
    // Clamp to a reasonable floor
    const safeMin = Math.max(computedMin, 0.3);
    setMinZoom(safeMin);
    setZoom(1); // reset to default
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      // Reset state for next image
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setMinZoom(1);
      onCropComplete(croppedDataUrl);
    } catch (err) {
      console.error('Crop failed:', err);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);

  if (!imageSrc) return null;

  return (
    <div className="crop-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="crop-modal">
        {/* Header */}
        <div className="crop-modal__header">
          <h3 className="crop-modal__title">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>crop</span>
            Crop Image {totalCount > 1 ? `(${currentIndex + 1} of ${totalCount})` : ''}
          </h3>
          <button className="crop-modal__close" onClick={onCancel} aria-label="Cancel">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Crop area */}
        <div className="crop-modal__canvas">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            aspect={1}
            objectFit="contain"
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
            onMediaLoaded={onMediaLoaded}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: { borderRadius: '8px' },
            }}
          />
        </div>

        {/* Zoom control */}
        <div className="crop-modal__controls">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            photo_size_select_small
          </span>
          <input
            type="range"
            min={minZoom}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-modal__zoom-slider"
            aria-label="Zoom"
          />
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
            photo_size_select_large
          </span>
        </div>

        {/* Actions */}
        <div className="crop-modal__actions">
          <button className="crop-modal__btn crop-modal__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-modal__btn crop-modal__btn--confirm" onClick={handleConfirm}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;

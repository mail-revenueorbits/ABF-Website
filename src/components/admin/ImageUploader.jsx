import React, { useRef, useCallback, useState } from 'react';
import { validateImage } from '../../utils/imageUtils';
import { uploadImage } from '../../lib/cloudinary';
import ImageCropModal from './ImageCropModal';

/**
 * Reads a File into a data-URL for the cropper preview.
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Multi-image uploader with mandatory 1:1 crop, then Cloudinary upload.
 * Props: images (string[]), onChange (fn), maxImages (number)
 */
function ImageUploader({ images = [], onChange, maxImages = 8 }) {
  const inputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Crop queue state
  const [cropQueue, setCropQueue] = useState([]);       // data-URLs awaiting crop
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [croppedResults, setCroppedResults] = useState([]); // cropped data-URLs ready to upload

  /**
   * Step 1: Read selected files into data-URLs and open crop modal queue.
   */
  const handleFiles = useCallback(async (files) => {
    const validFiles = [];
    for (const file of files) {
      if (validFiles.length + images.length >= maxImages) break;
      const validation = validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Read all files into data-URLs for the cropper
    const dataUrls = await Promise.all(validFiles.map(fileToDataUrl));
    setCropQueue(dataUrls);
    setCurrentCropIndex(0);
    setCroppedResults([]);
  }, [images, maxImages]);

  /**
   * Step 2: Called after each image is cropped. Accumulate results.
   */
  const handleCropComplete = useCallback(async (croppedDataUrl) => {
    const newResults = [...croppedResults, croppedDataUrl];
    setCroppedResults(newResults);

    if (currentCropIndex + 1 < cropQueue.length) {
      // Move to next image in queue
      setCurrentCropIndex(currentCropIndex + 1);
    } else {
      // All images cropped — now upload them all to Cloudinary
      setCropQueue([]);
      setCurrentCropIndex(0);
      setCroppedResults([]);
      await uploadCroppedImages(newResults);
    }
  }, [croppedResults, currentCropIndex, cropQueue]);

  /**
   * Step 3: Upload all cropped images to Cloudinary.
   */
  const uploadCroppedImages = async (croppedDataUrls) => {
    setIsProcessing(true);
    setProgress(0);
    const newImages = [...images];
    let processed = 0;

    try {
      for (const dataUrl of croppedDataUrls) {
        if (newImages.length >= maxImages) break;

        const result = await uploadImage(dataUrl, {
          folder: 'abf-website/products',
          onProgress: (p) => {
            const overallProgress = Math.round(((processed + p / 100) / croppedDataUrls.length) * 100);
            setProgress(overallProgress);
          },
        });

        newImages.push(result.url);
        processed++;
        setProgress(Math.round((processed / croppedDataUrls.length) * 100));
      }
      onChange(newImages);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload one or more images. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  /**
   * Cancel the entire crop session.
   */
  const handleCropCancel = useCallback(() => {
    setCropQueue([]);
    setCurrentCropIndex(0);
    setCroppedResults([]);
  }, []);

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

  const handleMoveLeft = useCallback((index) => {
    if (index <= 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    onChange(newImages);
  }, [images, onChange]);

  const handleMoveRight = useCallback((index) => {
    if (index >= images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    onChange(newImages);
  }, [images, onChange]);

  const isCropping = cropQueue.length > 0;

  return (
    <div>
      {/* Upload area */}
      <div
        className={`admin-image-upload ${isProcessing ? 'processing' : ''}`}
        onClick={() => !isProcessing && !isCropping && inputRef.current?.click()}
        onDrop={!isProcessing && !isCropping ? handleDrop : undefined}
        onDragOver={!isProcessing && !isCropping ? handleDragOver : undefined}
        style={{ opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
      >
        <span className="material-symbols-outlined">
          {isProcessing ? 'sync' : 'cloud_upload'}
        </span>
        <p>
          {isProcessing
            ? `Uploading... ${progress}%`
            : 'Click or drag images here'}
        </p>
        <p style={{ fontSize: '11px', marginTop: '4px' }}>
          {isProcessing
            ? 'Uploading to cloud...'
            : `Images will be cropped to square. ${images.length}/${maxImages} uploaded.`}
        </p>
        {isProcessing && (
          <div style={{
            width: '80%',
            height: '4px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '2px',
            marginTop: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--walnut)',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(Array.from(e.target.files));
            e.target.value = ''; // Reset so same file can be re-selected
          }}
          disabled={isProcessing || isCropping}
        />
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="admin-image-preview-grid">
          {images.map((src, i) => (
            <div key={i} className="admin-image-preview">
              <img src={src} alt={`Upload ${i + 1}`} />
              <span className="admin-image-preview-index">{i + 1}</span>
              <button
                type="button"
                className="admin-image-preview-remove"
                onClick={() => handleRemove(i)}
                title="Remove image"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
              </button>
              <div className="admin-image-preview-reorder">
                {i > 0 && (
                  <button
                    type="button"
                    className="admin-image-preview-move"
                    onClick={() => handleMoveLeft(i)}
                    title="Move left"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span>
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    type="button"
                    className="admin-image-preview-move"
                    onClick={() => handleMoveRight(i)}
                    title="Move right"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop modal — processes one image at a time from the queue */}
      {isCropping && (
        <ImageCropModal
          imageSrc={cropQueue[currentCropIndex]}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          currentIndex={currentCropIndex}
          totalCount={cropQueue.length}
        />
      )}
    </div>
  );
}

export default ImageUploader;

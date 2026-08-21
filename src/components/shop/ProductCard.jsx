import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { formatNPR } from '../../utils/formatCurrency';
import './ProductCard.css';

/**
 * Product Card with lifestyle-to-studio hover image swap.
 *
 * Default: lifestyle/room-setting image
 * On hover: white-background studio shot
 *
 * @param {{ product: import('../../data/products').Product }} props
 */
function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const primaryImage = hasImages ? product.images[0] : (product.lifestyleImage || '/products/_placeholder.jpg');
  const hoverImage = hasImages ? (product.images.length > 1 ? product.images[1] : product.images[0]) : primaryImage;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="pc-card group"
      aria-label={`View ${product.name}`}
    >
      {/* Image container with hover swap */}
      <div className="pc-image-wrap">
        {/* Primary image (default visible) */}
        <img
          src={primaryImage}
          alt={`${product.name} primary view`}
          className="pc-img pc-img--lifestyle"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />
        {/* Alternate image (visible on hover) */}
        {hasImages && product.images.length > 1 && (
          <img
            src={hoverImage}
            alt={`${product.name} alternate view`}
            className="pc-img pc-img--studio"
            loading="lazy"
          />
        )}

        {/* Skeleton while loading */}
        {!imgLoaded && <div className="pc-img-skeleton skeleton-shimmer" />}

        {/* Tag badge */}
        {product.tag && <span className="pc-tag">{product.tag}</span>}

        {/* Wishlist button */}
        <button
          className={`pc-wishlist-btn ${wishlisted ? 'pc-wishlist-btn--active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className="material-symbols-outlined">
            {wishlisted ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Sale badge */}
        {product.salePrice && (
          <span className="pc-sale-badge">
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </span>
        )}

        {/* Quick peek overlay on hover */}
        <div className="pc-hover-overlay">
          <span className="pc-quick-view">View Details</span>
        </div>
      </div>

      {/* Product info */}
      <div className="pc-info">
        <p className="pc-material">{product.material.split(',')[0]}</p>
        <h3 className="pc-name">{product.name}</h3>
        <div className="pc-price-row">
          {product.salePrice ? (
            <>
              <span className="pc-price pc-price--sale">{formatNPR(product.salePrice)}</span>
              <span className="pc-price pc-price--original">{formatNPR(product.price)}</span>
            </>
          ) : (
            <span className="pc-price">{formatNPR(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

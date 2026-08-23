import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import useProductStore from '../../store/productStore';
import './WishlistDrawer.css';

function formatNPR(amount) {
  if (!amount) return 'Price on Request';
  return 'Rs. ' + Number(amount).toLocaleString('en-IN');
}

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const products = useProductStore((state) => state.products);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeWishlist();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeWishlist]);

  // Match wishlisted IDs with actual product objects
  const wishlistedProducts = useMemo(() => {
    return items
      .map((id) => products.find((p) => String(p.id) === String(id)))
      .filter(Boolean);
  }, [items, products]);

  const totalValue = useMemo(() => {
    return wishlistedProducts.reduce((sum, p) => {
      const price = Number(p.salePrice || p.price || 0);
      return sum + price;
    }, 0);
  }, [wishlistedProducts]);

  if (!isOpen) return null;

  // Bulk WhatsApp inquiry message
  const handleInquireAll = () => {
    const lines = [
      "Namaste AB Furniture! I am interested in these items saved in my wishlist:",
      "",
      ...wishlistedProducts.map((p, i) => `${i + 1}. ${p.name} (${formatNPR(p.salePrice || p.price)}) - https://www.abfurniturenepal.com/product/${p.slug || p.id}`),
      "",
      `Total Estimated Value: ${formatNPR(totalValue)}`,
      "",
      "Please let me know about availability, finish options, and delivery time to Kathmandu Valley."
    ];
    const encoded = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/9779818421463?text=${encoded}`, '_blank');
  };

  const handleSingleInquire = (product) => {
    const msg = `Namaste AB Furniture! I'm interested in the "${product.name}" (${formatNPR(product.salePrice || product.price)}). Link: https://www.abfurniturenepal.com/product/${product.slug || product.id}`;
    window.open(`https://wa.me/9779818421463?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="wishlist-overlay" onClick={closeWishlist}>
      <div className="wishlist-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Your Wishlist">
        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-header-left">
            <span className="material-symbols-outlined wishlist-header-icon">favorite</span>
            <div>
              <h2 className="wishlist-title">Saved Items</h2>
              <span className="wishlist-count-badge">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button className="wishlist-close-btn" onClick={closeWishlist} aria-label="Close wishlist">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="wishlist-body">
          {wishlistedProducts.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon-wrap">
                <span className="material-symbols-outlined">favorite_border</span>
              </div>
              <h3 className="wishlist-empty-title">Your wishlist is empty</h3>
              <p className="wishlist-empty-desc">
                Tap the heart icon on any piece to save your favorite furniture for easy ordering or inquiry.
              </p>
              <Link to="/shop" className="wishlist-empty-btn" onClick={closeWishlist}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlistedProducts.map((product) => {
                const img = Array.isArray(product.images) && product.images.length > 0 
                  ? product.images[0] 
                  : '/products/_placeholder.jpg';
                const price = product.salePrice || product.price;

                return (
                  <div key={product.id} className="wishlist-item-card">
                    <Link 
                      to={`/product/${product.slug || product.id}`} 
                      className="wishlist-item-img-wrap"
                      onClick={closeWishlist}
                    >
                      <img src={img} alt={product.name} loading="lazy" />
                    </Link>

                    <div className="wishlist-item-info">
                      <div className="wishlist-item-top">
                        <Link 
                          to={`/product/${product.slug || product.id}`} 
                          className="wishlist-item-name"
                          onClick={closeWishlist}
                        >
                          {product.name}
                        </Link>
                        <button 
                          className="wishlist-item-remove"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>

                      {product.material && (
                        <span className="wishlist-item-meta">{product.material}</span>
                      )}

                      <div className="wishlist-item-price-row">
                        <span className="wishlist-item-price">{formatNPR(price)}</span>
                        {product.salePrice && product.price && (
                          <span className="wishlist-item-original-price">{formatNPR(product.price)}</span>
                        )}
                      </div>

                      <div className="wishlist-item-actions">
                        <button 
                          className="wishlist-item-inquire-btn"
                          onClick={() => handleSingleInquire(product)}
                        >
                          <span className="material-symbols-outlined">chat</span>
                          <span>Inquire</span>
                        </button>
                        <Link 
                          to={`/product/${product.slug || product.id}`} 
                          className="wishlist-item-view-btn"
                          onClick={closeWishlist}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="wishlist-footer">
            <div className="wishlist-summary-row">
              <span className="wishlist-summary-label">Estimated Total</span>
              <span className="wishlist-summary-value">{formatNPR(totalValue)}</span>
            </div>
            
            <button className="wishlist-inquire-all-btn" onClick={handleInquireAll}>
              <span className="material-symbols-outlined">chat</span>
              <span>Inquire All on WhatsApp</span>
            </button>

            <div className="wishlist-footer-secondary">
              <button className="wishlist-clear-btn" onClick={clearWishlist}>
                Clear Wishlist
              </button>
              <Link to="/shop" className="wishlist-continue-link" onClick={closeWishlist}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

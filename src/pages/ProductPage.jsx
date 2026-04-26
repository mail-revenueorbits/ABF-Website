import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductPage.css';
import {
  getProductById,
  getRelatedProducts,
  getProductsByIds,
} from '../services/productService';
import { formatNPR } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { getWhatsAppLink } from '../services/whatsapp';
import ProductCard from '../components/shop/ProductCard';

// Admin-edited products store descriptions as WYSIWYG HTML. The PDP renders
// descriptions as plain text inside a <p>, so strip tags and collapse
// whitespace before display. Using a regex (not DOMParser) keeps this SSR-safe.
function plainDescription(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p\s*>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  const mainImageRef = useRef(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();

  // Fetch product
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setQuantity(1);
    setActiveImageIndex(0);
    setZoomActive(false);
    setActiveAccordion('details');

    getProductById(id).then((data) => {
      if (cancelled) return;
      setProduct(data);
      setSelectedVariant(data?.variants?.[0] || null);
      setLoading(false);

      if (data) {
        addToRecentlyViewed(data.id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    getRelatedProducts(product.id, 4).then(setRelatedProducts);
  }, [product]);

  // Fetch recently viewed products (excluding current)
  useEffect(() => {
    if (!product) return;
    const recentIds = recentlyViewed.filter((rid) => rid !== product.id).slice(0, 4);
    if (recentIds.length === 0) {
      setRecentProducts([]);
      return;
    }
    getProductsByIds(recentIds).then(setRecentProducts);
  }, [product, recentlyViewed]);

  // Image zoom handlers
  const handleMouseMove = useCallback(
    (e) => {
      if (!mainImageRef.current) return;
      const rect = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    []
  );

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity((q) => q - 1);
    if (type === 'inc' && quantity < 10) setQuantity((q) => q + 1);
  };

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? '' : key));
  };

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="pdp-loading-grid container">
          <div className="pdp-loading-gallery">
            <div className="pdp-loading-main skeleton-shimmer" />
            <div className="pdp-loading-thumbs">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pdp-loading-thumb skeleton-shimmer" />
              ))}
            </div>
          </div>
          <div className="pdp-loading-info">
            <div className="skeleton-shimmer" style={{ height: 18, width: '30%', marginBottom: 16 }} />
            <div className="skeleton-shimmer" style={{ height: 40, width: '80%', marginBottom: 12 }} />
            <div className="skeleton-shimmer" style={{ height: 28, width: '40%', marginBottom: 32 }} />
            <div className="skeleton-shimmer" style={{ height: 80, width: '100%', marginBottom: 24 }} />
            <div className="skeleton-shimmer" style={{ height: 56, width: '100%', marginBottom: 16 }} />
            <div className="skeleton-shimmer" style={{ height: 56, width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found container">
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--text-muted)' }}>
          inventory_2
        </span>
        <h1 className="heading-2" style={{ marginTop: 24 }}>
          Product Not Found
        </h1>
        <p className="body-lg" style={{ color: 'var(--text-muted)', marginTop: 8 }}>
          This product may have been removed or the link is incorrect.
        </p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 32 }}>
          <span>Browse Collection</span>
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const displayPrice = product.salePrice || product.price;
  const whatsappUrl = getWhatsAppLink({
    productName: product.name,
    price: formatNPR(displayPrice),
    sku: product.sku,
    quantity,
    variant: selectedVariant?.name,
  });

  return (
    <>
      <div className="pdp container">
        {/* Breadcrumbs */}
        <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{product.subcategory}</Link>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          {/* ===== LEFT: Gallery ===== */}
          <div className="pdp-gallery">
            {/* Main image with zoom */}
            <div
              className={`pdp-main-image ${zoomActive ? 'pdp-main-image--zoomed' : ''}`}
              ref={mainImageRef}
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleMouseMove}
              role="img"
              aria-label={`${product.name} - image ${activeImageIndex + 1}`}
            >
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.name} - view ${activeImageIndex + 1}`}
                className="pdp-main-img"
                style={
                  zoomActive
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: 'scale(2)',
                      }
                    : {}
                }
              />
              {zoomActive && (
                <div className="pdp-zoom-hint">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    zoom_in
                  </span>
                  Move mouse to zoom
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="pdp-thumbnails">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`pdp-thumb ${activeImageIndex === index ? 'pdp-thumb--active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: Product Info ===== */}
          <div className="pdp-info">
            {/* SKU and tag */}
            <div className="pdp-meta-top">
              <span className="pdp-sku">SKU: {product.sku}</span>
              {product.tag && <span className="pdp-badge">{product.tag}</span>}
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            {/* Price */}
            <div className="pdp-price-block">
              {product.salePrice ? (
                <>
                  <span className="pdp-price pdp-price--current">
                    {formatNPR(product.salePrice)}
                  </span>
                  <span className="pdp-price pdp-price--was">{formatNPR(product.price)}</span>
                  <span className="pdp-price-save">
                    Save {formatNPR(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="pdp-price pdp-price--current">{formatNPR(product.price)}</span>
              )}
            </div>

            {/* Stock status */}
            <div className="pdp-stock">
              <span
                className="pdp-stock-dot"
                style={{
                  backgroundColor: product.inStock ? '#2D6A4F' : '#C41E3A',
                }}
              />
              <span>
                {product.inStock
                  ? product.madeToOrder
                    ? 'In Stock / Made to Order Available'
                    : 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="pdp-description">{plainDescription(product.description)}</p>

            {/* Color/Fabric Variants */}
            {product.variants.length > 0 && (
              <div className="pdp-variants">
                <span className="pdp-variants-label">
                  Finish:{' '}
                  <strong>{selectedVariant?.name || product.variants[0].name}</strong>
                </span>
                <div className="pdp-variant-swatches">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`pdp-swatch ${selectedVariant?.id === v.id ? 'pdp-swatch--active' : ''}`}
                      style={{ '--swatch-color': v.colorHex }}
                      onClick={() => setSelectedVariant(v)}
                      aria-label={v.name}
                      title={v.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Buy Now */}
            <div className="pdp-actions">
              <div className="pdp-qty">
                <button
                  className="pdp-qty-btn"
                  onClick={() => handleQuantity('dec')}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                </button>
                <span className="pdp-qty-value">{quantity}</span>
                <button
                  className="pdp-qty-btn"
                  onClick={() => handleQuantity('inc')}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pdp-buy-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_bag</span>
                <span>Buy Now</span>
              </a>
            </div>

            {/* Wishlist + WhatsApp row */}
            <div className="pdp-secondary-actions">
              <button
                className={`pdp-wishlist-btn ${wishlisted ? 'pdp-wishlist-btn--active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {wishlisted ? 'favorite' : 'favorite_border'}
                </span>
                <span>{wishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pdp-whatsapp-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                <span>Talk to a Designer</span>
              </a>
            </div>

            {/* Trust Signals */}
            <div className="pdp-trust-signals">
              <div className="pdp-trust-item">
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Free Delivery in KTM</span>
              </div>
              <div className="pdp-trust-item">
                <span className="material-symbols-outlined">shield</span>
                <span>{product.warranty}</span>
              </div>
              <div className="pdp-trust-item">
                <span className="material-symbols-outlined">autorenew</span>
                <span>Easy Returns</span>
              </div>
              <div className="pdp-trust-item">
                <span className="material-symbols-outlined">verified</span>
                <span>Premium Quality</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="pdp-accordions">
              {/* Features */}
              <div className="pdp-accordion">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('features')}
                  aria-expanded={activeAccordion === 'features'}
                >
                  <span>Features</span>
                  <span className="material-symbols-outlined">
                    {activeAccordion === 'features' ? 'remove' : 'add'}
                  </span>
                </button>
                {activeAccordion === 'features' && (
                  <div className="pdp-accordion-content">
                    <ul>
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Dimensions & Details */}
              <div className="pdp-accordion">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('details')}
                  aria-expanded={activeAccordion === 'details'}
                >
                  <span>Dimensions & Details</span>
                  <span className="material-symbols-outlined">
                    {activeAccordion === 'details' ? 'remove' : 'add'}
                  </span>
                </button>
                {activeAccordion === 'details' && (
                  <div className="pdp-accordion-content">
                    <ul>
                      {product.dimensions?.height && (
                        <li>
                          <strong>Height:</strong> {product.dimensions.height}
                        </li>
                      )}
                      {product.dimensions?.width && (
                        <li>
                          <strong>Width:</strong> {product.dimensions.width}
                        </li>
                      )}
                      {product.dimensions?.depth && (
                        <li>
                          <strong>Depth:</strong> {product.dimensions.depth}
                        </li>
                      )}
                      {product.dimensions?.seatHeight && (
                        <li>
                          <strong>Seat Height:</strong> {product.dimensions.seatHeight}
                        </li>
                      )}
                      {product.dimensions?.details &&
                        !product.dimensions?.height &&
                        !product.dimensions?.width && (
                          <li>
                            <strong>Size:</strong> {product.dimensions.details}
                          </li>
                        )}
                      <li>
                        <strong>Material:</strong> {product.material}
                      </li>
                      {product.seatingCapacity && (
                        <li>
                          <strong>Seating Capacity:</strong> {product.seatingCapacity}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="pdp-accordion">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('care')}
                  aria-expanded={activeAccordion === 'care'}
                >
                  <span>Care Instructions</span>
                  <span className="material-symbols-outlined">
                    {activeAccordion === 'care' ? 'remove' : 'add'}
                  </span>
                </button>
                {activeAccordion === 'care' && (
                  <div className="pdp-accordion-content">
                    <p>{product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div className="pdp-accordion">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleAccordion('shipping')}
                  aria-expanded={activeAccordion === 'shipping'}
                >
                  <span>Shipping & Delivery</span>
                  <span className="material-symbols-outlined">
                    {activeAccordion === 'shipping' ? 'remove' : 'add'}
                  </span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="pdp-accordion-content">
                    <p>{product.deliveryInfo}</p>
                    <p style={{ marginTop: 12 }}>
                      Free white-glove delivery inside Kathmandu Valley. Our team will
                      deliver, unpack, and place the furniture in your room. Outside valley
                      shipping charges apply based on weight and size (typically NPR 500-1,000).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related">
          <div className="container">
            <div className="pdp-related-header">
              <div>
                <p className="overline section-overline">You May Also Like</p>
                <h2 className="heading-2">Related Products</h2>
              </div>
              <Link to={`/shop?category=${product.category}`} className="view-all">
                View All
              </Link>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="pdp-recent">
          <div className="container">
            <div className="pdp-related-header">
              <div>
                <p className="overline section-overline">Keep Exploring</p>
                <h2 className="heading-2">Recently Viewed</h2>
              </div>
            </div>
            <div className="pdp-related-grid">
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductPage;

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../services/productService';
import { formatNPR } from '../../utils/formatCurrency';
import './FeaturedCollection.css';

function FeaturedCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    async function loadProducts() {
      const data = await getFeaturedProducts(8);
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  /** Compute discount percentage */
  function getDiscount(product) {
    if (!product.salePrice || product.salePrice >= product.price) return null;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  }

  return (
    <section className="featured-section" ref={sectionRef}>
      <div className="container">
        <div className="featured-header">
          <div className="section-header reveal">
            <p className="overline section-overline">Curated For You</p>
            <h2 className="heading-1 section-title">Popular Picks</h2>
            <p className="body-lg section-subtitle">
              Our most-loved pieces chosen by hundreds of happy customers.
            </p>
          </div>
          <Link className="view-all reveal" to="/shop">View All Products</Link>
        </div>

        {loading ? (
          <div className="fc-skeleton-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="fc-skeleton-card">
                <div className="fc-skeleton-img" />
                <div className="fc-skeleton-text" />
                <div className="fc-skeleton-text fc-skeleton-text--short" />
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => {
              const discount = getDiscount(product);
              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className={`pc-card reveal reveal-delay-${(index % 4) + 1}`}
                >
                  <div className="pc-card__image-wrap">
                    <img
                      alt={`${product.name} - ${product.material?.split(',')[0]}`}
                      className="pc-card__img"
                      src={product.images[0]}
                      loading={index < 4 ? 'eager' : 'lazy'}
                    />
                    {product.images[1] && (
                      <img
                        alt={`${product.name} alternate view`}
                        className="pc-card__img pc-card__img--hover"
                        src={product.images[1]}
                        loading="lazy"
                      />
                    )}
                    <div className="pc-card__image-overlay">
                      <span className="pc-card__quick-view">View Details</span>
                    </div>

                    {/* Tag badge top-left */}
                    {product.tags && product.tags.length > 0 && (
                      <span className={`pc-card__tag pc-card__tag--${product.tags[0]}`}>
                        {product.tags[0]}
                      </span>
                    )}

                    {/* Sale badge top-right */}
                    {discount && (
                      <span className="pc-card__sale-badge">-{discount}%</span>
                    )}

                    {/* Wishlist hint */}
                    <button
                      className="pc-card__wishlist"
                      aria-label={`Add ${product.name} to wishlist`}
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="material-symbols-outlined">favorite_border</span>
                    </button>
                  </div>

                  <div className="pc-card__info">
                    {product.material && (
                      <p className="pc-card__material">{product.material.split(',')[0]}</p>
                    )}
                    <h3 className="pc-card__name">{product.name}</h3>

                    {/* Star rating */}
                    <div className="pc-card__rating" aria-label="4.8 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined pc-card__star"
                          aria-hidden="true"
                        >
                          star
                        </span>
                      ))}
                      <span className="pc-card__rating-count">(4.{Math.floor(Math.random() * 3) + 6})</span>
                    </div>

                    {/* Price row */}
                    <div className="pc-card__price-row">
                      {product.salePrice ? (
                        <>
                          <span className="pc-card__price pc-card__price--sale">
                            {formatNPR(product.salePrice)}
                          </span>
                          <span className="pc-card__price pc-card__price--original">
                            {formatNPR(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="pc-card__price">
                          {formatNPR(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Delivery badge */}
                    <p className="pc-card__delivery">
                      <span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>
                      Free delivery
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedCollection;

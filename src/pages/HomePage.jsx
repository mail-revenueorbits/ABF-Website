import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedCollection from '../components/home/FeaturedCollection';
import { getBestsellerProducts, getNewArrivals } from '../services/productService';
import { formatNPR } from '../utils/formatCurrency';
import './HomePage.css';


/* -------------------------------------------------
   Scroll reveal hook — observes all .home-reveal
   elements within a ref and adds .is-visible
   ------------------------------------------------- */
function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = (el) => {
      if (!el.classList.contains('is-visible')) observer.observe(el);
    };

    ref.current.querySelectorAll('.home-reveal').forEach(observe);

    // Sections like ProductRailSection render asynchronously after an API
    // call resolves. A MutationObserver picks up those new reveal elements
    // so they animate in instead of staying invisible (which caused a large
    // empty gap on the homepage).
    const mo = new MutationObserver((muts) => {
      for (const mut of muts) {
        mut.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.classList?.contains('home-reveal')) observe(node);
          node.querySelectorAll?.('.home-reveal').forEach(observe);
        });
      }
    });
    mo.observe(ref.current, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [ref]);
}


/* ===================================================
   HOME PAGE
   =================================================== */
function HomePage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);

  return (
    <div ref={pageRef}>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Inline Trust Bar — compact version of "Why Choose Us" */}
      <TrustBar />

      {/* 3. Categories Grid */}
      <CategoriesSection />

      {/* 4. Featured Products (8 products, 4-col grid) */}
      <FeaturedCollection />

      {/* 5. Shop by Room — quick visual links */}
      <ShopByRoomSection />

      {/* 6. New Arrivals + Bestsellers — dual product rail */}
      <ProductRailSection />

      {/* 7. Shop by Material — compact */}
      <MaterialsSection />

      {/* 8. Customer Stats + Testimonials combined */}
      <SocialProofSection />

      {/* 9. WhatsApp CTA Banner */}
      <CTABannerSection />
    </div>
  );
}


/* -------------------------------------------------
   TRUST BAR — Compact inline badges
   Replaces the old 4-pillar "Why Choose Us" section
   ------------------------------------------------- */
const trustBadges = [
  { icon: 'workspace_premium', label: '20 Years of Trust' },
  { icon: 'local_shipping', label: 'Free Delivery in KTM' },
  { icon: 'verified_user', label: 'Up to 5-Year Warranty' },
  { icon: 'design_services', label: 'Custom Made in 10-20 Days' },
  { icon: 'forest', label: 'Sheesham & Teak Wood' },
];

function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Trust signals">
      <div className="trust-bar__container">
        {trustBadges.map((badge, i) => (
          <div key={i} className="trust-bar__item">
            <span className="material-symbols-outlined trust-bar__icon" aria-hidden="true">
              {badge.icon}
            </span>
            <span className="trust-bar__label">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


/* -------------------------------------------------
   CATEGORIES GRID — Browse by Product Type
   ------------------------------------------------- */
// Real-campaign hero shots per category. Slugs map to /shop?category= values
// defined in src/data/products.js (see `categories` export).
const categories = [
  {
    name: 'Sofas',
    slug: 'sofas',
    count: '11 Designs',
    image: '/products/C1-01/cover.jpg',
  },
  {
    name: 'Office Chairs',
    slug: 'office-chairs',
    count: '23 Options',
    image: '/products/C1-09/cover.jpg',
  },
  {
    name: 'Dining & Tables',
    slug: 'dining',
    count: '7 Sets',
    image: '/products/C5-02/cover.jpg',
  },
  {
    name: 'Beds',
    slug: 'beds',
    count: '8 Styles',
    image: '/products/C3-01/cover.jpg',
  },
  {
    name: 'Curtains',
    slug: 'curtains',
    count: '51 Fabrics',
    image: '/products/C3-07/cover.jpg',
  },
];

function CategoriesSection() {
  return (
    <section className="home-section" aria-labelledby="categories-title">
      <div className="home-section__container">
        <div className="home-section__header home-reveal">
          <p className="home-section__overline">Collections</p>
          <h2 className="home-section__title" id="categories-title">Browse by Category</h2>
          <p className="home-section__subtitle">
            From the living room to the boardroom, each collection is crafted
            with intention and finished to perfection.
          </p>
        </div>

        <div className="categories-browse">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className={`cat-card home-reveal home-reveal--delay-${index + 1}`}
              aria-label={`Explore ${cat.name} — ${cat.count}`}
            >
              <img
                src={cat.image}
                alt={`${cat.name} furniture collection`}
                className="cat-card__img"
                loading="lazy"
              />
              <div className="cat-card__overlay" aria-hidden="true" />
              <div className="cat-card__content">
                <p className="cat-card__count">{cat.count}</p>
                <h3 className="cat-card__name">{cat.name}</h3>
                <span className="cat-card__link" aria-hidden="true">
                  Explore <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------
   SHOP BY ROOM — Visual quick links
   ------------------------------------------------- */
const rooms = [
  {
    name: 'Living Room',
    image: '/products/C5-04/cover.jpg',
    link: '/shop?category=sofas',
    items: 'Sofas & Sets',
  },
  {
    name: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80&auto=format',
    link: '/shop?category=beds',
    items: 'Beds & Nightstands',
  },
  {
    name: 'Dining Room',
    image: '/products/C5-03/cover.jpg',
    link: '/shop?category=dining',
    items: 'Dining Sets',
  },
  {
    name: 'Home Office',
    image: '/products/C4-19/cover.jpg',
    link: '/shop?category=office-chairs',
    items: 'Office Chairs',
  },
];

function ShopByRoomSection() {
  return (
    <section className="home-section home-section--ivory" aria-labelledby="rooms-title">
      <div className="home-section__container">
        <div className="home-section__header home-reveal">
          <p className="home-section__overline">Inspiration</p>
          <h2 className="home-section__title" id="rooms-title">Shop by Room</h2>
          <p className="home-section__subtitle">
            Find the perfect furniture for every space in your home.
          </p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <Link
              key={room.name}
              to={room.link}
              className={`room-card home-reveal home-reveal--delay-${index + 1}`}
              aria-label={`Shop ${room.name} furniture — ${room.items}`}
            >
              <img
                src={room.image}
                alt={`${room.name} furniture`}
                className="room-card__img"
                loading="lazy"
              />
              <div className="room-card__overlay" aria-hidden="true" />
              <div className="room-card__content">
                <p className="room-card__items">{room.items}</p>
                <h3 className="room-card__name">{room.name}</h3>
                <span className="room-card__cta">
                  Shop Now <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------
   PRODUCT RAIL — New Arrivals + Bestsellers
   Two side-by-side product strips
   ------------------------------------------------- */
function ProductRailSection() {
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const [n, b] = await Promise.all([getNewArrivals(4), getBestsellerProducts(4)]);
      setNewProducts(n);
      setBestProducts(b);
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) return null;

  return (
    <section className="home-section" aria-labelledby="product-rails-title">
      <div className="home-section__container">
        <div className="product-rails">
          {/* New Arrivals */}
          <div className="product-rail home-reveal">
            <div className="product-rail__header">
              <h3 className="product-rail__title" id="product-rails-title">
                <span className="material-symbols-outlined" aria-hidden="true">new_releases</span>
                New Arrivals
              </h3>
              <Link to="/shop?sort=newest" className="product-rail__view-all">
                View All <span>&rarr;</span>
              </Link>
            </div>
            <div className="product-rail__list">
              {newProducts.map((p) => (
                <ProductRailCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Bestsellers */}
          <div className="product-rail home-reveal home-reveal--delay-2">
            <div className="product-rail__header">
              <h3 className="product-rail__title">
                <span className="material-symbols-outlined" aria-hidden="true">local_fire_department</span>
                Bestsellers
              </h3>
              <Link to="/shop?sort=popular" className="product-rail__view-all">
                View All <span>&rarr;</span>
              </Link>
            </div>
            <div className="product-rail__list">
              {bestProducts.map((p) => (
                <ProductRailCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact horizontal product card for rails */
function ProductRailCard({ product }) {
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <Link to={`/product/${product.id}`} className="rail-card">
      <div className="rail-card__img-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="rail-card__img"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="rail-card__badge">-{discount}%</span>
        )}
      </div>
      <div className="rail-card__info">
        <p className="rail-card__material">{product.material?.split(',')[0]}</p>
        <h4 className="rail-card__name">{product.name}</h4>
        <div className="rail-card__price-row">
          {product.salePrice ? (
            <>
              <span className="rail-card__price rail-card__price--sale">{formatNPR(product.salePrice)}</span>
              <span className="rail-card__price rail-card__price--original">{formatNPR(product.price)}</span>
            </>
          ) : (
            <span className="rail-card__price">{formatNPR(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}


/* -------------------------------------------------
   SHOP BY MATERIAL — Sheesham, Teak, Marble
   (Kept but made more compact)
   ------------------------------------------------- */
const materials = [
  {
    name: 'Sheesham Wood',
    label: 'Foundation',
    slug: 'sheesham',
    desc: 'Indian Rosewood prized for its rich grain and natural durability.',
    image: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=85&auto=format',
  },
  {
    name: 'Teak Wood',
    label: 'Premium',
    slug: 'teak',
    desc: 'Naturally weather-resistant. The wood of choice for our Royal collection.',
    image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&q=85&auto=format',
  },
  {
    name: 'Italian Marble',
    label: 'Luxury',
    slug: 'marble',
    desc: 'Genuine imported marble surfaces that transform tables into statement pieces.',
    image: 'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?w=800&q=85&auto=format',
  },
];

function MaterialsSection() {
  return (
    <section className="home-section home-section--dark home-section--compact" aria-labelledby="materials-title">
      <div className="home-section__container">
        <div className="materials-row home-reveal">
          <div className="materials-row__header">
            <p className="home-section__overline">Our Materials</p>
            <h2 className="home-section__title" id="materials-title">Built from the Finest</h2>
          </div>
          <div className="materials-compact">
            {materials.map((mat, index) => (
              <Link
                key={mat.slug}
                to={`/shop?material=${mat.slug}`}
                className={`material-chip home-reveal home-reveal--delay-${index + 1}`}
                aria-label={`Shop ${mat.name} furniture`}
              >
                <img
                  src={mat.image}
                  alt={`${mat.name} texture`}
                  className="material-chip__img"
                  loading="lazy"
                />
                <div className="material-chip__overlay" aria-hidden="true" />
                <div className="material-chip__content">
                  <p className="material-chip__label">{mat.label}</p>
                  <h3 className="material-chip__name">{mat.name}</h3>
                  <p className="material-chip__desc">{mat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------
   SOCIAL PROOF — Stats + Testimonials combined
   ------------------------------------------------- */
const stats = [
  { number: '2,500+', label: 'Happy Customers' },
  { number: '20+', label: 'Years of Trust' },
  { number: '70+', label: 'Product Designs' },
  { number: '4.8', label: 'Average Rating', icon: 'star' },
];

const testimonials = [
  {
    text: 'We furnished our entire home from AB Furniture. The Sheesham dining table with Italian marble top is the centerpiece of every family gathering.',
    author: 'Rajesh Shrestha',
    role: 'Homeowner, Lazimpat',
    initials: 'RS',
    stars: 5,
  },
  {
    text: 'Ordered 15 office chairs for our new office. Great quality, fast delivery, and the 2-year warranty gives us peace of mind.',
    author: 'Suman Gurung',
    role: 'Office Manager, Baneshwor',
    initials: 'SG',
    stars: 5,
  },
  {
    text: 'The custom curtains transformed our living room completely. Premium fabric quality and the team helped us choose the perfect design.',
    author: 'Priya Acharya',
    role: 'Interior Enthusiast, Baluwatar',
    initials: 'PA',
    stars: 5,
  },
];

function SocialProofSection() {
  return (
    <section className="home-section" aria-labelledby="social-proof-title">
      <div className="home-section__container">
        {/* Stats strip */}
        <div className="stats-strip home-reveal">
          {stats.map((stat, i) => (
            <div key={i} className="stats-strip__item">
              <p className="stats-strip__number">
                {stat.icon && (
                  <span className="material-symbols-outlined stats-strip__icon" aria-hidden="true">
                    {stat.icon}
                  </span>
                )}
                {stat.number}
              </p>
              <p className="stats-strip__label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="home-section__header home-section__header--center home-reveal" style={{ marginTop: '56px' }}>
          <p className="home-section__overline">Customer Stories</p>
          <h2 className="home-section__title" id="social-proof-title">Trusted by Thousands</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <article
              key={index}
              className={`testimonial-card home-reveal home-reveal--delay-${index + 1}`}
            >
              <div className="testimonial-card__stars" role="img" aria-label={`${t.stars} out of 5 stars`}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined testimonial-card__star"
                    aria-hidden="true"
                  >
                    star
                  </span>
                ))}
              </div>
              <blockquote className="testimonial-card__text">{t.text}</blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" aria-hidden="true">{t.initials}</div>
                <div>
                  <p className="testimonial-card__name">{t.author}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------
   WHATSAPP CTA BANNER — Visit Showroom
   ------------------------------------------------- */
function CTABannerSection() {
  return (
    <section className="home-section home-section--cta" aria-labelledby="cta-title">
      <div className="home-section__container">
        <div className="cta-banner home-reveal">
          <div className="cta-banner__bg" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=70&auto=format"
              alt=""
              className="cta-banner__bg-img"
              loading="lazy"
            />
            <div className="cta-banner__overlay" />
          </div>

          <div className="cta-banner__content">
            <p className="cta-banner__overline">Visit Our Showroom</p>
            <h2 className="cta-banner__title" id="cta-title">
              Experience Our Furniture in Person
            </h2>
            <p className="cta-banner__subtitle">
              Visit our Gyaneshwor showroom to see, touch, and experience our full
              collection. Our expert team is ready to help you find the perfect pieces.
            </p>
            <div className="cta-banner__actions">
              <a
                href="https://wa.me/9779802322678?text=Hi!%20I'd%20like%20to%20visit%20your%20showroom.%20What%20are%20the%20timings?"
                className="cta-banner__btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp about visiting the showroom"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.547 4.098 1.504 5.828L0 24l6.335-1.462A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.87 0-3.63-.5-5.14-1.38l-.37-.22-3.76.87.9-3.65-.24-.38A9.78 9.78 0 012.18 12c0-5.42 4.4-9.82 9.82-9.82 5.42 0 9.82 4.4 9.82 9.82 0 5.42-4.4 9.82-9.82 9.82z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+9779802322678"
                className="cta-banner__btn-phone"
                aria-label="Call AB Furniture at 980-2322678"
              >
                <span className="material-symbols-outlined" aria-hidden="true">call</span>
                <span>Call 980-2322678</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default HomePage;

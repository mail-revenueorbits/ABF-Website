import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';
import HeroMobileCategories from './HeroMobileCategories';
import HeroMobileCarousels from './HeroMobileCarousels';
import './Hero.css';

/* ─────────────────────────────────────────────
   Hero slides data (carousel on desktop left card)
   ───────────────────────────────────────────── */
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85&auto=format',
    tag: 'New Arrivals',
    title: 'Premium Sofa Sets',
    subtitle: 'Starting from NPR 24,999',
    cta: 'Shop Sofas',
    link: '/shop?category=sofas',
    overlay: 'warm',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=85&auto=format',
    tag: 'Best Sellers',
    title: 'Italian Marble Dining',
    subtitle: 'Luxury crafted tables from NPR 49,999',
    cta: 'Explore Dining',
    link: '/shop?category=dining',
    overlay: 'dark',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85&auto=format',
    tag: 'Exclusive Collection',
    title: 'Sheesham Wood Beds',
    subtitle: '5-year warranty on all beds',
    cta: 'Browse Beds',
    link: '/shop?category=beds',
    overlay: 'warm',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85&auto=format',
    tag: 'Custom Orders',
    title: 'Complete Interior Design',
    subtitle: 'Transform your space in 10-20 days',
    cta: 'Get a Quote',
    link: '/shop?category=custom',
    overlay: 'dark',
  },
];

/* ─────────────────────────────────────────────
   Static right-side cards (desktop)
   ───────────────────────────────────────────── */
const rightCards = [
  {
    id: 'right-1',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format',
    tag: 'Trending',
    title: 'Ergonomic Office Chairs',
    subtitle: 'From NPR 12,999',
    link: '/shop?category=office',
    cta: 'Shop Now',
  },
  {
    id: 'right-2',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&auto=format',
    tag: 'Furnishing',
    title: 'Premium Curtains & Carpets',
    subtitle: 'Starting NPR 599',
    link: '/shop?category=furnishing',
    cta: 'Explore',
  },
];


/* ═══════════════════════════════════════════════
   HERO — Main Component
   ═══════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="hero-section">
      {/* ── DESKTOP LAYOUT ── */}
      <div className="hero-desktop">
        <div className="hero-grid">
          {/* Left — Large carousel card */}
          <div className="hero-main-card">
            <HeroCarousel slides={heroSlides} />
          </div>

          {/* Right — Two stacked static cards */}
          <div className="hero-sidebar">
            {rightCards.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="hero-side-card"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="hero-side-img"
                  loading="eager"
                />
                <div className="hero-side-overlay" />
                <div className="hero-side-content">
                  <span className="hero-side-tag">{card.tag}</span>
                  <h3 className="hero-side-title">{card.title}</h3>
                  <p className="hero-side-subtitle">{card.subtitle}</p>
                  <span className="hero-side-cta">
                    {card.cta} <span className="hero-side-arrow">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="hero-mobile">
        <HeroMobileSearchBar />
        <HeroMobileCategories />
        <HeroMobileCarousels />
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────
   Mobile Search Bar
   ───────────────────────────────────────────── */
function HeroMobileSearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form className="hero-mob-search" onSubmit={handleSubmit}>
      <span className="material-symbols-outlined hero-mob-search-icon">search</span>
      <input
        type="text"
        placeholder="Search sofas, beds, curtains..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="hero-mob-search-input"
        aria-label="Search products"
      />
      {query && (
        <button
          type="button"
          className="hero-mob-search-clear"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </form>
  );
}


export default Hero;

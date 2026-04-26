import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Mobile carousel sections — 5+ offer carousels
   Each section is a small horizontal carousel of
   hero/offer images (Wooden Street mobile style)
   ───────────────────────────────────────────── */

const MOBILE_CAROUSELS = [
  {
    id: 'mc-offers',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format',
        tag: 'Limited Offer',
        title: 'Sofa Sets from NPR 24,999',
        subtitle: 'Premium 5-seater options',
        link: '/shop?category=sofas',
      },
      {
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80&auto=format',
        tag: 'Best Seller',
        title: 'Italian Marble Dining Tables',
        subtitle: 'Luxury from NPR 49,999',
        link: '/shop?category=dining',
      },
      {
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80&auto=format',
        tag: '5-Year Warranty',
        title: 'Sheesham Wood Beds',
        subtitle: 'Solid hardwood construction',
        link: '/shop?category=beds',
      },
    ],
  },
  {
    id: 'mc-new',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format',
        tag: 'New Arrival',
        title: 'Ergonomic Office Chairs',
        subtitle: '2-Year warranty on hydraulics',
        link: '/shop?category=office',
      },
      {
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80&auto=format',
        tag: 'Trending',
        title: 'Gaming Chairs Collection',
        subtitle: 'Premium comfort for gamers',
        link: '/shop?category=gaming-chairs',
      },
      {
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format',
        tag: 'Custom',
        title: 'Interior Design Consultation',
        subtitle: 'Transform your space',
        link: '/shop?category=custom',
      },
    ],
  },
  {
    id: 'mc-furnishing',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80&auto=format',
        tag: 'From NPR 599',
        title: 'Premium Curtains',
        subtitle: 'Custom lengths & fabrics',
        link: '/shop?category=curtains',
      },
      {
        image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80&auto=format',
        tag: 'Furnishing',
        title: 'Handwoven Carpets',
        subtitle: 'Add warmth to every room',
        link: '/shop?category=carpets',
      },
      {
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&auto=format',
        tag: 'Wall Decor',
        title: 'Wallpapers & Flooring',
        subtitle: 'Complete your interiors',
        link: '/shop?category=wallpapers',
      },
    ],
  },
  {
    id: 'mc-premium',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80&auto=format',
        tag: 'Exclusive',
        title: 'Bar Units & Sets',
        subtitle: 'Entertain in style',
        link: '/shop?category=bar-units',
      },
      {
        image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80&auto=format',
        tag: 'Storage',
        title: 'Wardrobes & Cabinets',
        subtitle: 'Solid wood construction',
        link: '/shop?category=wardrobes',
      },
    ],
  },
  {
    id: 'mc-consoles',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=800&q=80&auto=format',
        tag: 'Decor',
        title: 'Mirrors & Consoles',
        subtitle: 'Statement pieces for your home',
        link: '/shop?category=consoles',
      },
      {
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format',
        tag: 'Commercial',
        title: 'Cafe & Restaurant Furniture',
        subtitle: 'Durable commercial-grade',
        link: '/shop?category=cafe',
      },
    ],
  },
];


function HeroMobileCarousels() {
  return (
    <div className="hero-mob-carousels">
      <div className="hero-mob-carousel-row">
        {MOBILE_CAROUSELS.map((carousel) => (
          <MobileCarouselSection
            key={carousel.id}
            slides={carousel.slides}
          />
        ))}
      </div>

      {/* WhatsApp CTA banner at end */}
      <a
        href="https://wa.me/9779802322678?text=Hi!%20I'm%20interested%20in%20your%20furniture%20collection."
        className="hero-mob-whatsapp-banner"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.547 4.098 1.504 5.828L0 24l6.335-1.462A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.87 0-3.63-.5-5.14-1.38l-.37-.22-3.76.87.9-3.65-.24-.38A9.78 9.78 0 012.18 12c0-5.42 4.4-9.82 9.82-9.82 5.42 0 9.82 4.4 9.82 9.82 0 5.42-4.4 9.82-9.82 9.82z" />
        </svg>
        <div className="hero-mob-whatsapp-text">
          <span className="hero-mob-whatsapp-title">Chat with us on WhatsApp</span>
          <span className="hero-mob-whatsapp-sub">Get instant quotes &amp; availability</span>
        </div>
        <span className="material-symbols-outlined">chevron_right</span>
      </a>
    </div>
  );
}


/* ─────────────────────────────────────────────
   Single mobile carousel section
   ───────────────────────────────────────────── */
function MobileCarouselSection({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = slides.length;
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  /* Autoplay */
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next, isPaused]);

  /* Touch handlers */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div
      className="hero-mob-carousel-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-mob-carousel-track">
        {slides.map((slide, index) => (
          <Link
            key={index}
            to={slide.link}
            className={`hero-mob-carousel-slide ${index === current ? 'is-active' : ''}`}
            aria-hidden={index !== current}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-mob-carousel-img"
              loading="lazy"
              draggable={false}
            />
            <div className="hero-mob-carousel-overlay" />
            <div className="hero-mob-carousel-content">
              <span className="hero-mob-carousel-tag">{slide.tag}</span>
              <h3 className="hero-mob-carousel-title">{slide.title}</h3>
              <p className="hero-mob-carousel-subtitle">{slide.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Dots */}
      <div className="hero-mob-carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-mob-carousel-dot ${index === current ? 'is-active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


export default HeroMobileCarousels;

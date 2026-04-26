import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HeroCarousel.css';

const AUTO_PLAY_INTERVAL = 5000;

function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const total = slides.length;

  /* ── Navigation ── */
  const goTo = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  /* ── Autoplay ── */
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [next, isPaused]);

  /* ── Touch / Swipe ── */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="hero-carousel__track">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-carousel__slide ${index === current ? 'is-active' : ''}`}
            aria-hidden={index !== current}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-carousel__img"
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
            <div className={`hero-carousel__overlay hero-carousel__overlay--${slide.overlay}`} />

            {/* Content overlay */}
            <div className="hero-carousel__content">
              <span className="hero-carousel__tag">{slide.tag}</span>
              <h2 className="hero-carousel__title">{slide.title}</h2>
              <p className="hero-carousel__subtitle">{slide.subtitle}</p>
              <div className="hero-carousel__actions">
                <Link to={slide.link} className="hero-carousel__cta-primary">
                  <span>{slide.cta}</span>
                </Link>
                <a
                  href={`https://wa.me/9779802322678?text=${encodeURIComponent(`Hi! I'm interested in ${slide.title}`)}`}
                  className="hero-carousel__cta-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.547 4.098 1.504 5.828L0 24l6.335-1.462A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.87 0-3.63-.5-5.14-1.38l-.37-.22-3.76.87.9-3.65-.24-.38A9.78 9.78 0 012.18 12c0-5.42 4.4-9.82 9.82-9.82 5.42 0 9.82 4.4 9.82 9.82 0 5.42-4.4 9.82-9.82 9.82z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        className="hero-carousel__arrow hero-carousel__arrow--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        className="hero-carousel__arrow hero-carousel__arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Dot Indicators */}
      <div className="hero-carousel__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-carousel__dot ${index === current ? 'is-active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="hero-carousel__progress">
        <div
          className="hero-carousel__progress-bar"
          style={{
            animationDuration: `${AUTO_PLAY_INTERVAL}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          key={current}
        />
      </div>
    </div>
  );
}

export default HeroCarousel;

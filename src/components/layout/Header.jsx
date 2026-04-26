import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY) {
            if (currentScrollY > 200) {
              setIsScrolled(true);
            }
          } else {
            if (currentScrollY < 100) {
              setIsScrolled(false);
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  const navCategories = [
    { label: 'Sofas', path: '/shop?category=sofas' },
    { label: 'Chairs', path: '/shop?category=office-chairs' },
    { label: 'Dining', path: '/shop?category=dining' },
    { label: 'Beds', path: '/shop?category=beds' },
    { label: 'Curtains', path: '/shop?category=curtains' },
    { label: 'All Products', path: '/shop' },
  ];

  const roomLinks = [
    { label: 'Living Room', path: '/shop?category=sofas' },
    { label: 'Bedroom', path: '/shop?category=beds' },
    { label: 'Dining Room', path: '/shop?category=dining' },
    { label: 'Home Office', path: '/shop?category=office-chairs' },
  ];

  return (
    <>
      {/* Promo bar at the very top */}
      <div className="promo-bar">
        <div className="promo-bar__inner">
          <span className="promo-bar__text">
            <span className="material-symbols-outlined promo-bar__icon" aria-hidden="true">local_shipping</span>
            Free delivery inside Kathmandu Valley
          </span>
          <span className="promo-bar__divider" aria-hidden="true" />
          <span className="promo-bar__text">
            <span className="material-symbols-outlined promo-bar__icon" aria-hidden="true">verified_user</span>
            Up to 5-year warranty
          </span>
          <span className="promo-bar__divider promo-bar__divider--hide-mobile" aria-hidden="true" />
          <span className="promo-bar__text promo-bar__text--hide-mobile">
            <span className="material-symbols-outlined promo-bar__icon" aria-hidden="true">call</span>
            <a href="tel:+9779802322678" className="promo-bar__link">+977 980-2322678</a>
          </span>
        </div>
      </div>

      <header className={`header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <div className="header-top">
            <div className="header-left">
              <Link to="/shop" aria-label="Search products">
                <span className="material-symbols-outlined">search</span>
              </Link>
            </div>
            <Link to="/" className="logo">AB Furniture</Link>
            <div className="header-actions">
              <a href="tel:+9779802322678" className="header-contact">
                <span className="material-symbols-outlined">call</span>
                <span>+977 980-2322678</span>
              </a>
              <a
                href="https://wa.me/9779802322678"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
              >
                <span className="material-symbols-outlined">chat</span>
              </a>
              <Link to="/shop" aria-label="Wishlist" style={{ position: 'relative' }}>
                <span className="material-symbols-outlined">favorite_border</span>
                {wishlistCount > 0 && (
                  <span className="header-badge">{wishlistCount}</span>
                )}
              </Link>
            </div>
          </div>
          <nav className="header-nav">
            <div className="header-nav-left">
              <Link to="/" className="logo logo--nav">AB Furniture</Link>
            </div>
            <div className="header-nav-center">
              {navCategories.map((cat) => (
                <Link key={cat.label} to={cat.path}>
                  {cat.label}
                </Link>
              ))}
            </div>
            <div className="header-nav-right">
              <div className="header-actions-scrolled">
                <Link to="/shop" aria-label="Search">
                  <span className="material-symbols-outlined">search</span>
                </Link>
                <Link to="/shop" aria-label="Wishlist" style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined">favorite_border</span>
                  {wishlistCount > 0 && (
                    <span className="header-badge">{wishlistCount}</span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile header */}
        <div className="header-mobile">
          <button aria-label="Menu" onClick={() => setMobileMenuOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="logo">AB Furniture</Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/shop" aria-label="Search">
              <span className="material-symbols-outlined" style={{ color: 'var(--walnut)' }}>search</span>
            </Link>
            <Link to="/shop" aria-label="Wishlist" style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--walnut)' }}>favorite_border</span>
              {wishlistCount > 0 && (
                <span className="header-badge">{wishlistCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="logo">AB Furniture</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mobile-menu-links">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>All Products</Link>

              <p className="mobile-menu-section-label">Shop by Category</p>
              {navCategories.filter(c => c.label !== 'All Products').map((cat) => (
                <Link key={cat.label} to={cat.path} onClick={() => setMobileMenuOpen(false)}>
                  {cat.label}
                </Link>
              ))}

              <p className="mobile-menu-section-label">Shop by Room</p>
              {roomLinks.map((room) => (
                <Link key={room.label} to={room.path} onClick={() => setMobileMenuOpen(false)}>
                  {room.label}
                </Link>
              ))}
            </div>
            <div className="mobile-menu-footer">
              <a href="tel:+9779802322678" className="mobile-menu-contact">
                <span className="material-symbols-outlined">call</span>
                +977 980-2322678
              </a>
              <a
                href="https://wa.me/9779802322678"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-menu-contact mobile-menu-contact--whatsapp"
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp Us
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;

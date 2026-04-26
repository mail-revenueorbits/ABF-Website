import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">AB Furniture and Furnishing</Link>
            <p className="footer-tagline">Luxury for the Exceptional</p>
            <p className="footer-desc">
              Handcrafted premium furniture in Sheesham Wood, Teak,
              and Italian Marble. Built in Kathmandu for the most
              discerning Nepali homes and spaces.
            </p>
          </div>
          <div className="footer-links-container">
            <div>
              <h4 className="footer-section-title">Collections</h4>
              <div className="footer-links">
                <Link to="/shop?category=living">Living Room</Link>
                <Link to="/shop?category=dining">Dining</Link>
                <Link to="/shop?category=bedroom">Bedroom</Link>
                <Link to="/shop?category=office">Office</Link>
                <Link to="/shop?category=cafe">Cafe & Commercial</Link>
              </div>
            </div>
            <div>
              <h4 className="footer-section-title">Company</h4>
              <div className="footer-links">
                <Link to="/about">Our Story</Link>
                <Link to="/shop">All Products</Link>
                <a href="https://wa.me/9779818421463" target="_blank" rel="noopener noreferrer">Interior Projects</a>
                <a href="https://wa.me/9779818421463" target="_blank" rel="noopener noreferrer">Contact Us</a>
              </div>
            </div>
            <div>
              <h4 className="footer-section-title">Visit Us</h4>
              <div className="footer-links">
                <p>Gyaneshwor, Kathmandu</p>
                <p>Nepal</p>
                <a href="tel:+9779818421463" className="footer-phone">+977 981-8421463</a>
                <a href="https://wa.me/9779818421463" target="_blank" rel="noopener noreferrer" className="footer-whatsapp">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AB Furniture and Furnishing & Furnishing. All Rights Reserved.</p>
          <p>Gyaneshwor, Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

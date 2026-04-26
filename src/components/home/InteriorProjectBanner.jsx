import React, { useEffect, useRef } from 'react';
import './InteriorProjectBanner.css';

function InteriorProjectBanner() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="interior-banner" ref={sectionRef}>
      <div className="banner-wrapper">
        <div className="banner-text">
          <div className="text-content reveal">
            <p className="banner-overline">Interior Design Services</p>
            <h2 className="banner-title">
              Transform Your Space,<br />
              <em>Start to Finish</em>
            </h2>
            <p className="banner-subtitle">
              End-to-end interior design for homes, offices, and commercial spaces.
              From concept to installation, we bring your vision to life with
              premium materials and expert craftsmanship.
            </p>
            <div className="banner-stats">
              <div>
                <span className="banner-stat-number">200+</span>
                <span className="banner-stat-label">Projects</span>
              </div>
              <div>
                <span className="banner-stat-number">15+</span>
                <span className="banner-stat-label">Years</span>
              </div>
              <div>
                <span className="banner-stat-number">100%</span>
                <span className="banner-stat-label">Custom</span>
              </div>
            </div>
            <a href="https://wa.me/9779818421463" className="banner-link" target="_blank" rel="noopener noreferrer">
              Start Your Project
              <span className="material-symbols-outlined banner-link-arrow">arrow_forward</span>
            </a>
          </div>
        </div>
        <div className="banner-visual">
          <div className="visual-image"></div>
          <div className="visual-gradient-overlay"></div>
        </div>
      </div>
    </section>
  );
}

export default InteriorProjectBanner;

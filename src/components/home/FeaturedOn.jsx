import React from 'react';
import './FeaturedOn.css';

/* ─────────────────────────────────────────────
   FEATURED ON — Social Proof Logo Bar
   Shows publication/partner logos for credibility.
   Uses text placeholders; replace with SVGs later.
   ───────────────────────────────────────────── */

const logos = [
  { name: 'AD', full: 'Architectural Digest' },
  { name: 'DECOR', full: 'Decor Magazine' },
  { name: 'iHOME', full: 'iHome Nepal' },
  { name: 'The Indian EXPRESS', full: 'The Indian Express' },
  { name: 'Business Standard', full: 'Business Standard' },
];

function FeaturedOn() {
  return (
    <section className="featured-on home-reveal" aria-label="Featured in publications">
      <div className="featured-on__container">
        <p className="featured-on__label">Featured On</p>
        <div className="featured-on__logos" role="list">
          {logos.map((logo) => (
            <span
              key={logo.name}
              className="featured-on__logo"
              role="listitem"
              aria-label={logo.full}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedOn;

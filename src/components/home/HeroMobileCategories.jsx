import React from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Category data for the two scrollable rows
   ───────────────────────────────────────────── */
const categoryRows = [
  [
    { name: 'Sofas', icon: 'weekend', slug: 'sofas', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70&auto=format' },
    { name: 'Beds', icon: 'bed', slug: 'beds', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200&q=70&auto=format' },
    { name: 'Dining', icon: 'dining', slug: 'dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=200&q=70&auto=format' },
    { name: 'Office', icon: 'desktop_windows', slug: 'office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=70&auto=format' },
    { name: 'Curtains', icon: 'curtains', slug: 'curtains', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=70&auto=format' },
  ],
  [
    { name: 'Wardrobes', icon: 'door_sliding', slug: 'wardrobes', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=200&q=70&auto=format' },
    { name: 'Carpets', icon: 'texture', slug: 'carpets', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&q=70&auto=format' },
    { name: 'Bar Units', icon: 'liquor', slug: 'bar-units', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=200&q=70&auto=format' },
    { name: 'Gaming', icon: 'sports_esports', slug: 'gaming-chairs', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200&q=70&auto=format' },
    { name: 'Mirrors', icon: 'filter_frames', slug: 'mirrors', image: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=200&q=70&auto=format' },
  ],
];


function HeroMobileCategories() {
  return (
    <div className="hero-mob-categories">
      {categoryRows.map((row, rowIdx) => (
        <div key={rowIdx} className="hero-mob-cat-row">
          <div className="hero-mob-cat-scroll">
            {row.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="hero-mob-cat-item"
              >
                <div className="hero-mob-cat-icon-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="hero-mob-cat-img"
                    loading="lazy"
                  />
                </div>
                <span className="hero-mob-cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroMobileCategories;

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Categories() {
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
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      name: 'Sofas',
      slug: 'sofas',
      count: '4',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format',
      featured: true
    },
    {
      name: 'Chairs',
      slug: 'chairs',
      count: '4',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80&auto=format'
    },
    {
      name: 'Tables',
      slug: 'tables',
      count: '4',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&auto=format'
    },
    {
      name: 'Storage',
      slug: 'storage',
      count: '2',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80&auto=format'
    },
    {
      name: 'Furnishing',
      slug: 'furnishing',
      count: '1',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80&auto=format'
    }
  ];

  return (
    <section className="categories-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <p className="overline section-overline">Collections</p>
          <h2 className="heading-1 section-title">Curated for Every Room</h2>
          <p className="body-lg section-subtitle">
            From the living room to the boardroom, each collection is crafted
            with intention and finished to perfection.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              className={`category-card reveal reveal-delay-${index + 1} ${category.featured ? 'category-card--featured' : ''}`}
              to={`/shop?category=${category.slug}`}
            >
              <img
                alt={`${category.name} furniture collection`}
                className="category-img"
                src={category.image}
                loading="lazy"
              />
              <div className="category-overlay"></div>
              <div className="category-content">
                <p className="category-count">{category.count} Pieces</p>
                <h3 className="heading-3 category-title">{category.name}</h3>
                <span className="category-link">
                  Explore Collection <span className="category-link-arrow">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;

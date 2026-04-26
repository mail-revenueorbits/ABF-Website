import React, { useEffect, useRef } from 'react';

function MaterialShowcase() {
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
      { threshold: 0.1 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const materials = [
    {
      name: 'Sheesham Wood',
      label: 'Foundation',
      desc: 'The backbone of our finest pieces. Indian Rosewood prized for its rich grain, natural durability, and warm tones that deepen with age.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&auto=format'
    },
    {
      name: 'Teak Wood',
      label: 'Premium',
      desc: 'Naturally weather-resistant and incredibly strong. The wood of choice for our Royal collection, offering unmatched longevity.',
      image: 'https://images.unsplash.com/photo-1566312922674-2e341cbf0a32?w=600&q=80&auto=format'
    },
    {
      name: 'Italian Marble',
      label: 'Luxury',
      desc: 'Genuine imported marble surfaces that transform dining tables into statement pieces. Each slab carries unique veining patterns.',
      image: 'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?w=600&q=80&auto=format'
    }
  ];

  return (
    <section className="materials-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header-centered reveal" style={{ marginBottom: '80px' }}>
          <p className="overline section-overline section-overline-centered" style={{ color: 'var(--amber)' }}>
            Our Materials
          </p>
          <h2 className="heading-1" style={{ color: 'var(--ivory)' }}>
            Built from the Finest
          </h2>
          <p className="body-lg section-subtitle section-subtitle-centered" style={{ color: 'rgba(248, 245, 241, 0.5)' }}>
            Every piece begins with materials that honor the tradition of fine furniture making.
          </p>
        </div>

        <div className="materials-grid">
          {materials.map((material, index) => (
            <div key={index} className={`material-card reveal reveal-delay-${index + 1}`}>
              <img
                alt={`${material.name} texture and finish`}
                className="material-card-img"
                src={material.image}
                loading="lazy"
              />
              <div className="material-card-overlay"></div>
              <div className="material-card-content">
                <p className="material-card-label">{material.label}</p>
                <h3 className="material-card-name">{material.name}</h3>
                <p className="material-card-desc">{material.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MaterialShowcase;

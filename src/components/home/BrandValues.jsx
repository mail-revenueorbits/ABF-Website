import React from 'react';

function BrandValues() {
  const values = [
    {
      icon: 'forest',
      title: 'SHEESHAM & TEAK',
      desc: 'Solid premium hardwood construction'
    },
    {
      icon: 'diamond',
      title: 'ITALIAN MARBLE',
      desc: 'Genuine imported stone surfaces'
    },
    {
      icon: 'architecture',
      title: 'MADE IN KATHMANDU',
      desc: 'Local master craftsmanship'
    },
    {
      icon: 'verified',
      title: '5-YEAR WARRANTY',
      desc: 'Structural guarantee included'
    }
  ];

  return (
    <section className="brand-pillars">
      <div className="container">
        <div className="pillars-grid">
          {values.map((v, i) => (
            <div key={i} className="pillar-item">
              <span className="material-symbols-outlined pillar-icon">{v.icon}</span>
              <h4 className="overline pillar-title">{v.title}</h4>
              <p className="pillar-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandValues;

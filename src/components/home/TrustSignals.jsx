import React, { useEffect, useRef } from 'react';

function TrustSignals() {
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
      { threshold: 0.2 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const signals = [
    {
      icon: 'precision_manufacturing',
      title: 'Made in Nepal',
      desc: 'Proudly handcrafted in Kathmandu by master artisans using traditional woodworking techniques passed down through generations.'
    },
    {
      icon: 'account_balance_wallet',
      title: 'Flexible Payments',
      desc: 'Pay seamlessly via eSewa, Fonepay, Khalti, or choose Cash on Delivery. EMI options available for premium purchases.'
    },
    {
      icon: 'local_shipping',
      title: 'Valley-Wide Delivery',
      desc: 'Free delivery and professional setup inside Kathmandu Valley. Secure nationwide shipping available across Nepal.'
    }
  ];

  return (
    <section className="trust-section" ref={sectionRef}>
      <div className="container">
        <div className="trust-header reveal">
          <p className="overline">Why Choose AB Furniture</p>
          <h2 className="heading-2">The AB Difference</h2>
        </div>
        <div className="trust-grid">
          {signals.map((signal, index) => (
            <div key={index} className={`trust-item reveal reveal-delay-${index + 1}`}>
              <span className="material-symbols-outlined trust-icon">{signal.icon}</span>
              <h4 className="trust-title">{signal.title}</h4>
              <p className="trust-desc">{signal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSignals;

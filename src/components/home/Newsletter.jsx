import React, { useEffect, useRef } from 'react';

function Newsletter() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="newsletter-section" ref={sectionRef}>
      <div className="container">
        <div className="newsletter-inner reveal">
          <p className="overline">Stay Connected</p>
          <h2 className="heading-2">The Inner Circle</h2>
          <p className="body-md">
            Be the first to discover new collections, exclusive offers,
            and interior design inspiration delivered to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;

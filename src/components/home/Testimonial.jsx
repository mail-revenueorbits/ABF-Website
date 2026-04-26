import React, { useEffect, useRef } from 'react';

function Testimonial() {
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
      { threshold: 0.3 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="quote-section" ref={sectionRef}>
      <div className="container-narrow reveal">
        <p className="quote-text">
          We furnished our entire home from AB Furniture. The Sheesham dining table
          with Italian marble top is the centerpiece of every family gathering.
          Quality you can see and feel for generations.
        </p>
        <div className="divider-dot"></div>
        <p className="quote-author">Rajesh Shrestha</p>
        <p className="quote-role">Homeowner, Lazimpat</p>
      </div>
    </section>
  );
}

export default Testimonial;

import React, { useState, useRef, useEffect } from 'react';
import useInquiryStore from '../store/inquiryStore';
import './PremiumGamingChairLanding.css';

const WHATSAPP_NUMBER = "9779802322678"; // Actual ABF number

// Using placeholder URLs for the gallery since exact assets weren't available in directory
const IMAGES = [
  "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop", // Red chair
  "https://images.unsplash.com/photo-1612284949511-209043c16ee0?q=80&w=1200&auto=format&fit=crop", // Posture comparison
  "https://images.unsplash.com/photo-1598550473361-b58097b6a48f?q=80&w=1200&auto=format&fit=crop", // Recline
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop"  // Close up leather
];

const COLORS = [
  { id: 'red', name: 'Racing Red', hex: '#E53935' },
  { id: 'black', name: 'Carbon Black', hex: '#212121' },
  { id: 'blue', name: 'Electric Blue', hex: '#1E88E5' },
  { id: 'white', name: 'Arctic White', hex: '#F5F5F5' }
];

export default function PremiumGamingChairLanding() {
  const addInquiry = useInquiryStore(s => s.addInquiry);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const galleryRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle scroll detection for gallery indicators
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const width = galleryRef.current.offsetWidth;
        const scrollLeft = galleryRef.current.scrollLeft;
        const activeIndex = Math.round(scrollLeft / width);
        setCurrentSlide(activeIndex);
      }
    };

    const ref = galleryRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addInquiry({
      name: formData.name,
      phone: formData.phone,
      deliveryLocation: formData.location,
      productOfInterest: `Premium Gaming Chair (${selectedColor.name})`,
      message: "Lead from Promo Landing Page (COD Requested)",
      preferredContact: "phone",
      budgetRange: "Rs. 28,799"
    });
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Smooth scroll to success state
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const generateWhatsAppLink = () => {
    const text = `Hi, I just submitted an order for the *Premium Gaming Chair*\n\n` +
      `*Color:* ${selectedColor.name}\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Location:* ${formData.location}\n\n` +
      `I'd like to confirm this order.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="gaming-landing-container">
      {/* 4:5 Swipeable Gallery */}
      <div className="gallery-wrapper">
        <div className="gallery-scroll" ref={galleryRef}>
          {IMAGES.map((src, index) => (
            <div key={index} className="gallery-slide">
              <img src={src} alt={`Gaming Chair Slide ${index + 1}`} className="gallery-image" />
            </div>
          ))}
        </div>
        <div className="gallery-indicators">
          {IMAGES.map((_, index) => (
            <div 
              key={index} 
              className={`gallery-dot ${currentSlide === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-item">
          <span className="material-symbols-outlined">local_shipping</span>
          Fast Delivery
        </div>
        <div className="trust-item">
          <span className="material-symbols-outlined">verified</span>
          110+ Sold
        </div>
        <div className="trust-item urgency">
          <span className="material-symbols-outlined">local_fire_department</span>
          Only 11 Left
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info-container">
        <span className="brand-overline">AB Furniture & Furnishing</span>
        <h1 className="product-title">Premium Ergonomic Gaming Chair</h1>
        <div className="product-price">Rs. 28,799</div>

        {/* Color Selector */}
        <div className="color-selector-section">
          <div className="color-label">
            <span>Select Color:</span>
            <span style={{ color: 'var(--color-primary-400)' }}>{selectedColor.name}</span>
          </div>
          <div className="color-options">
            {COLORS.map(color => (
              <div 
                key={color.id}
                className={`color-circle ${selectedColor.id === color.id ? 'active' : ''}`}
                style={{ '--swatch-color': color.hex }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="features-list">
          <div className="feature-item">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Retractable Footrest for ultimate relaxation</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Adjustable Ergonomic Lumbar & Neck Support</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">check_circle</span>
            <span>180° Recline Mechanism (Game, Work, Relax)</span>
          </div>
          <div className="feature-item">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Premium PU Leather (Durable & Breathable)</span>
          </div>
        </div>
      </div>

      {/* Form / Success Section */}
      {!isSuccess ? (
        <div className="form-section" id="order-form">
          <div className="form-header">
            <h2 className="form-title">Secure Yours Now</h2>
            <p className="form-subtitle">Fill out your details to lock in this price.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="landing-form-group">
              <label className="landing-form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                className="landing-form-input" 
                placeholder="e.g. Aayush Sharma"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="landing-form-group">
              <label className="landing-form-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                required
                className="landing-form-input" 
                placeholder="e.g. 9841000000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="landing-form-group">
              <label className="landing-form-label">Delivery Location</label>
              <input 
                type="text" 
                name="location"
                required
                className="landing-form-input" 
                placeholder="e.g. Baneshwor, Kathmandu"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="cod-notice">
              <span className="material-symbols-outlined">money</span>
              <div className="cod-notice-text">
                <strong>Cash on Delivery (COD) Only.</strong><br/>
                No advance payment required. We will call you at {formData.phone || 'your number'} to confirm the order before dispatching.
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Order Details'}
              {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>
        </div>
      ) : (
        <div className="success-state">
          <div className="success-icon">
            <span className="material-symbols-outlined">done</span>
          </div>
          <h2 className="success-title">Order Received!</h2>
          <p className="success-message">
            Thank you, {formData.name.split(' ')[0]}! We have received your order details.<br/><br/>
            <strong>Our team will call you shortly to confirm the delivery.</strong>
          </p>
          
          <a 
            href={generateWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-btn"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message on WhatsApp for Faster Processing
          </a>
        </div>
      )}
    </div>
  );
}

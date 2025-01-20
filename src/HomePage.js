import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', href, to, variant = 'primary', ...props }) => {
  const baseClass = `btn btn-${variant} ${className}`;
  
  if (href) {
    return <a href={href} className={baseClass} {...props}>{children}</a>;
  }
  
  if (to) {
    return <Link to={to} className={baseClass} {...props}>{children}</Link>;
  }
  return <button className={baseClass} {...props}>{children}</button>;
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting)
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "IIT Delhi, 2023",
      content: "The mentorship program completely transformed my JEE preparation journey.",
      image: "/student1.jpg"
    },
    {
      name: "Priya Patel",
      role: "IIT Bombay, 2023",
      content: "The structured approach and 24/7 support made all the difference.",
      image: "/student2.jpg"
    }
  ];

  return (
    <div className="modern-app">
      <header className="modern-header">
      <nav className="nav-container">
      <Link to="/" className="logo">
        <div className="logo-wrapper">
          <span className="logo-text">JEE ELEVATE</span>
        </div>
      </Link>
      
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
      </button>
      
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/courses" onClick={() => setIsMenuOpen(false)}>Courses</Link>
        <Link to="/mentors" onClick={() => setIsMenuOpen(false)}>Mentors</Link>
        <Link to="/success-stories" onClick={() => setIsMenuOpen(false)}>Success Stories</Link>
        <Button to="/login" className="nav-cta" onClick={() => setIsMenuOpen(false)}>
          Start Learning
        </Button>
      </div>
    </nav>
      </header>

      <main>
        <section ref={heroRef} className="hero-section">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title"
            >
              Transform Your
              <span className="gradient-text"> JEE Journey</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-subtitle"
            >
              Learn from IITians, Master Advanced Concepts, Achieve Your Dreams
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-cta-group"
            >
              <Button className="hero-cta primary">
                Start Free Trial
                <span className="btn-hover-effect"></span>
              </Button>
              <Button className="hero-cta secondary">
                Watch Success Stories
              </Button>
            </motion.div>
          </div>
          <div className="hero-visual">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-header">
            <h2>Why Choose JEE Elevate?</h2>
            <div className="accent-line"></div>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "🎯",
                title: "Personalized Learning",
                description: "AI-driven study plans tailored to your strengths and weaknesses"
              },
              {
                icon: "👨‍🏫",
                title: "Expert Mentorship",
                description: "1:1 guidance from IIT alumni and top educators"
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description: "Real-time analytics and performance insights"
              },
              {
                icon: "🎮",
                title: "Interactive Learning",
                description: "Gamified practice sessions and live doubt solving"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-hover"></div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-container">
            <motion.div 
              className="testimonial-card"
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="testimonial-content">
                <p>"{testimonials[activeTestimonial].content}"</p>
                <div className="testimonial-author">
                  <img src={testimonials[activeTestimonial].image} alt={testimonials[activeTestimonial].name} />
                  <div>
                    <h4>{testimonials[activeTestimonial].name}</h4>
                    <p>{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="testimonial-controls">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`control-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of successful students who achieved their IIT dreams</p>
            <Button className="cta-button">
              Begin Your Success Story
              <span className="btn-gradient"></span>
            </Button>
          </div>
          <div className="cta-visual">
            <div className="floating-elements">
              <div className="element element-1"></div>
              <div className="element element-2"></div>
              <div className="element element-3"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>JEE ELEVATE</h3>
            <p>Transforming aspirations into achievements</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <Link to="/about">About Us</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/success-stories">Success Stories</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/study-material">Study Material</Link>
              <Link to="/faqs">FAQs</Link>
            </div>
            <div className="link-group">
              <h4>Connect</h4>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 JEE ELEVATE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
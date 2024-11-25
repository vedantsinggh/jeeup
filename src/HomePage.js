import React, { useRef, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

// Enhanced Button component that supports both button and link functionality
const Button = ({ 
  children, 
  className = '', 
  href, 
  to,
  variant = 'primary',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClass}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  if (to) {
    return (
      <Link 
        to={to} 
        className={baseClass}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={baseClass}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const HomePage = () => {
  const contactRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add form validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('Please fill in all fields');
      return;
    }
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setFormStatus('Message sent successfully!');
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Stats and features data remain the same
  const stats = [
    { icon: <i className="fas fa-users fa-2x stats-icon" />, value: "100+", label: "Students Enrolled" },
    { icon: <i className="fas fa-trophy fa-2x stats-icon" />, value: "80%", label: "Success Rate" },
    { icon: <i className="fas fa-graduation-cap fa-2x stats-icon" />, value: "10+", label: "IITians Created" },
    { icon: <i className="fas fa-star fa-2x stats-icon" />, value: "4.5/5", label: "Student Rating" },
  ];

  const features = [
    { icon: <i className="fas fa-brain" />, title: "Expert Faculty", description: "Learn from IIT alumni and subject matter experts" },
    { icon: <i className="fas fa-bullseye" />, title: "Focused Approach", description: "Personalized learning paths for maximum results" },
    { icon: <i className="fas fa-clock" />, title: "24/7 Support", description: "Round-the-clock doubt clearing assistance" },
    { icon: <i className="fas fa-book-open" />, title: "Complete Material", description: "Comprehensive study material and resources" },
  ];

  const navigationLinks = [
    { label: 'About', to: '/about' },
    { label: 'Contact', onClick: scrollToContact },
  ];

  return (
    <div className="app">
      {/* Enhanced Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <Link to="/" className="logo" style={{margin: "20px"}}>
                <img 
                  src="https://i.ibb.co/vhD6PnY/jeeelevate-removebg-preview.png" 
                  alt="JEE ELEVATE Logo" 
                  className="logo-image"
                />
                <span className="logo-text">JEE ELEVATE</span>
              </Link>
            </div>

            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? 
                <i className="fas fa-times" /> : 
                <i className="fas fa-bars" />
              }
            </button>

            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              {navigationLinks.map((link, index) => (
                link.onClick ? (
                  <button
                    key={index}
                    onClick={link.onClick}
                    className="nav-link"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={link.to}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button
                to="/login"
                variant="primary"
              >
                Login
              </Button>
            </nav>
          </div>
        </div>
      </header>


      {/* Main content sections remain the same until contact section */}
      <main className="main pt-16"> 
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-overlay">
            <img 
              src="https://www.shutterstock.com/image-photo/portrait-teenage-asian-boy-using-600nw-2155196027.jpg" 
              alt="Hero background" 
            />
          </div>
          <div className="hero-content">
            <h2>
              Be an <span>IITian</span>
            </h2>
            <p>Transform your dreams into reality</p>
            <a href='/login'>
            <Button className="hero-btn">
              Race Up Your Journey
              <i className="fas fa-arrow-right" />
            </Button>
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <div className="stat-content">
                  {stat.icon}
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2>Why Choose Us</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <Card key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing">
        <div className="container">
          <h2>Our Pricing Plans</h2>
          <div className="pricing-grid">
            {[
              {
                tier: "Bronze",
                image: "https://static.vecteezy.com/system/resources/previews/007/627/725/non_2x/bronze-award-sport-medal-for-winners-with-red-ribbon-vector.jpg",
                points: ["Mentorship", "Study Material", "₹1099"],
                enrollLink: "https://forms.gle/4aa3kD7cjgyKqMLN7",
              },
              {
                tier: "Silver",
                image: "https://static.vecteezy.com/system/resources/previews/007/476/562/non_2x/silver-award-sport-medal-for-winners-with-red-ribbon-vector.jpg",
                points: ["Doubt Solving", "Study Material", "₹1299"],
                enrollLink: "https://forms.gle/4aa3kD7cjgyKqMLN7",
              },
              {
                tier: "Gold",
                image: "https://static.vecteezy.com/system/resources/thumbnails/007/627/739/small_2x/golden-award-sport-medal-for-winners-with-red-ribbon-vector.jpg",
                points: ["Doubt Solving", "Study Material", "Mentorship", "1-on-1 Mentoring", "₹ 2199"],
                enrollLink: "https://forms.gle/4aa3kD7cjgyKqMLN7",
              },
            ].map(({ tier, image, points, enrollLink }) => (
              <Card key={tier} className="pricing-card">
                <div className="pricing-content">
                  <div className="pricing-image">
                    <img src={image} alt={`${tier} plan`} />
                  </div>
                  <h3>{tier} Plan</h3>
                  <ul>
                    {points.map((point, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Button as="a" href={enrollLink}>
                    Enroll Now
                    <i className="fas fa-arrow-right" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>


        <section ref={contactRef} className="contact bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="contact-info space-y-8">
                <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                {[
                  { icon: <i className="fas fa-envelope" />, title: "Email", value: "vedantsinggh@gmail.com" },
                  { icon: <i className="fas fa-phone" />, title: "Phone", value: "+91 7307140847" },
                  { icon: <i className="fas fa-map-marker-alt" />, title: "Location", value: "Rohini, Delhi" }
                ].map((contact, index) => (
                  <div key={index} className="contact-item flex items-start space-x-4">
                    <div className="contact-icon text-primary text-xl">
                      {contact.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{contact.title}</h4>
                      <p className="text-gray-600">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="contact-form p-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                      required
                    ></textarea>
                  </div>
                  {formStatus && (
                    <p className={`text-sm ${formStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                      {formStatus}
                    </p>
                  )}
                  <Button type="submit" className="w-full">
                    Send Message
                    <i className="fas fa-arrow-right ml-2" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 JEE-ELEVATE. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
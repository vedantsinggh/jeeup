import React, { useRef } from 'react';
import './HomePage.css'; // Import the CSS file

function HomePage() {
  // Create a reference for the Contact Us section
  const contactRef = useRef(null);

  // Scroll to the Contact Us section when called
  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div className="homepage">
      <header>
        <h1>JEEUP</h1>
        <nav>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="#" onClick={scrollToContact}>Contact</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Be an IITian</h2>
          <p>Let your light shine!</p>
          <button>Race Up Your Journey</button>
        </section>

        <section className="pricing-section">
          <h2>Our Pricing Plans</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <img src="https://img.freepik.com/premium-photo/human-brain-illustration-design-concept-with-smoke-dark-isolated-backround_800563-591.jpg" alt="Batch 1" />
              <h3>Batch 1</h3>
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
                <li>Point 3</li>
              </ul>
              <button>Enroll Now</button>
            </div>

            <div className="pricing-card">
              <img src="https://img.freepik.com/premium-photo/human-brain-illustration-design-concept-with-smoke-dark-isolated-backround_800563-591.jpg" alt="Batch 2" />
              <h3>Batch 2</h3>
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
                <li>Point 3</li>
              </ul>
              <button>Enroll Now</button>
            </div>

            <div className="pricing-card">
              <img src="https://img.freepik.com/premium-photo/human-brain-illustration-design-concept-with-smoke-dark-isolated-backround_800563-591.jpg" alt="Batch 3" />
              <h3>Batch 3</h3>
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
                <li>Point 3</li>
              </ul>
              <button>Enroll Now</button>
            </div>
          </div>
        </section>

        <section className="contact-form" ref={contactRef}>
          <h2>Contact Us</h2>
          <form>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" required></textarea>
            
            <button type="submit">Send Message</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 JEE-UP. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;

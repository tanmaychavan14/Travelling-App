import React, { useState, useEffect } from 'react';
import './Home.css';
import Sign_up_in from '../components/Sign_up_in';
import Navbar from '../components/Navbar';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // Make a logout request to the backend
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        setIsLoggedIn(false);
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      })
      .catch(err => console.log('Logout failed', err));
  };

  return (
    <div>
      <Navbar 
        setIsModalOpen={setIsModalOpen} 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        handleLogout={handleLogout} 
      />
      {isModalOpen && <Sign_up_in onClose={closeModal} setIsLoggedIn={setIsLoggedIn} />}
      
      <div id="home" className={`home-container ${isModalOpen ? 'blurred' : ''}`}>
        <div className='home-img'>
        <div className="search-bar">
          <input type="text" placeholder="Where do you want to go?" />
          <button>Search</button>
        </div>
        <div className='home-info'>
          <h1>Exploring the World</h1>
          Find your dream destinations, plan your adventures, and make memories that last a lifetime.
        </div>
        </div>
       

        <div className="recommendations">
          <h2>Top Recommendations</h2>
          <div className='recommendation-container'>
          <div className="recommendation-card">
            <div className="image-container">
              <img src="https://thumbs.dreamstime.com/blog/2023/12/golden-sands-to-azure-waters-why-photographers-find-goa-s-beaches-irresistible-88688-image203861442.jpg" alt="Place" />
            </div>
            <div className="content-container">
              <h3>Beautiful Beach</h3>
              <p>A breathtaking beach with crystal clear waters and white sand. Perfect for relaxation and watbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbber sports.<a href="">learn more</a></p>
            </div>
            
            </div>
          
          <div className="recommendation-card">
            <div className="image-container">
              <img src="https://thumbs.dreamstime.com/blog/2023/12/golden-sands-to-azure-waters-why-photographers-find-goa-s-beaches-irresistible-88688-image203861442.jpg" alt="Place" />
            </div>
            <div className="content-container">
              <h3>Beautiful Beach</h3>
              <p>A breathtaking beach with crystal clear waters and white sand. Perfect for relaxation and water sports.</p>
            </div>
            
            
          </div>
          <div className="recommendation-card">
            <div className="image-container">
              <img src="https://thumbs.dreamstime.com/blog/2023/12/golden-sands-to-azure-waters-why-photographers-find-goa-s-beaches-irresistible-88688-image203861442.jpg" alt="Place" />
            </div>
            <div className="content-container">
              <h3>Beautiful Beach</h3>
              <p>A breathtaking beach with crystal clear waters and white sand. Perfect for relaxation and water sports.</p>
            </div>
            
            
          </div>
          </div>
        </div>

        <div id="about" className="about-section">
  <h2>About Us</h2>
  <div className="about-content">
    <div className="about-image">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXA3HVJKc9mwI44BPgolG2XtcHetrDz0pXsA&s" alt="Traveling the world" />
    </div>
    <div className="about-text">
      <p>
        Welcome to <strong>Travelify</strong>, your ultimate companion for exploring the world! 🌍✨
      </p>
      <p>
        We believe travel is more than just a journey; it’s a story waiting to be written. At <strong>Travelify</strong>, our mission is to inspire, guide, and empower travelers to discover the beauty, culture, and adventure that every destination offers.
      </p>
      <h3>Who We Are</h3>
      <p>
        We’re a team of passionate travelers, storytellers, and tech enthusiasts who understand the magic of wanderlust. From hidden gems to world-famous landmarks, our platform is designed to make your travel planning effortless, personalized, and exciting.
      </p>
    </div>
  </div>
</div>

<div id="contact" className="contact-section">
  <h2>Contact Us</h2>
  <div className="contact-info">
    <p>
      <strong>Email:</strong> <a href="mailto:contact@travelify.com">travel@.com</a>
    </p>
    <p>
      <strong>Phone:</strong> <a href="tel:+1234567890">+1-234-567-890</a>
    </p>
    <p>
      <strong>Address:</strong> 123 Travelify Lane, Wanderlust City, Adventureland
    </p>
  </div>
  <div className="contact-map">
  <iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345092734!2d144.95373531552546!3d-37.81627974202159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5775ed7d5f8ec3b!2sMelbourne%20CBD%2C%20Victoria%2C%20Australia!5e0!3m2!1sen!2sin!4v1614061126494!5m2!1sen!2sin" 
  width="600" 
  height="300" 
  style={{ border: "0" }} 
  allowFullScreen="" 
  loading="lazy" 
  title="Google Maps Location"
/>

  </div>
</div>

      </div>
    </div>
  );
};

export default Home;

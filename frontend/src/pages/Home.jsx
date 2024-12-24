import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Signupin from '../components/Signupin';
import Navbar from '../components/Navbar';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = document.cookie.split('; ').find((row) => row.startsWith('token='));
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
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        setIsLoggedIn(false);
        
      })
      .catch((err) => {
        console.error('Logout failed', err);
        alert('Failed to log out. Please try again.');
      });
  };
  const navigate = useNavigate();
  const handleSearch = () => {
    if (searchQuery.trim() === '' && <p className="error-message">Search term is required!</p>) {
      alert('Please enter a search term.');
      return;
    }
    if (!isLoggedIn) {
      alert('Please log in to use the search feature.');
      openModal();
      return;
    }
    console.log(searchQuery)
    navigate(`/results?query=${searchQuery}`);
  };
  
  

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    console.log(query)
    // const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    // console.log(token)
    try {
      const response = await fetch(`http://localhost:5000/search-suggestions?query=${query}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
  
      if (data.length === 0) {
        setSuggestions(['No matches found']);
      } else {
        setSuggestions(data);
      }
  
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err.message);
      setSuggestions([`Error: ${err.message}`]);
      setShowSuggestions(true);
    }
  };
  

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <Navbar
        setIsModalOpen={setIsModalOpen}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout}
      />
      {isModalOpen && <Signupin onClose={closeModal} setIsLoggedIn={setIsLoggedIn} />}

   
      <div id="home" className={`home-container ${isModalOpen ? 'blurred' : ''}`}>
        <div className="home-img">
          <div className="search-bar" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
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
      <strong>Email:</strong>travel@.com
    </p>
    <p>
      <strong>Phone:</strong>+1-234-567-890
    </p>
    <p>
      <strong>Address:</strong> Daurnager ,Uran, Raigad, 400702
    </p>
  </div>
  <div className="contact-map">
 
  <iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.334215373712!2d72.93646987466038!3d18.872248758338348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7dbc1444939b5%3A0xff5768d853d407ca!2sDaurnager!5e0!3m2!1sen!2sin!4v1732128003554!5m2!1sen!2sin" 
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
   
  );
};

export default Home;

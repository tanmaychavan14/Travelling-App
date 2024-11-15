import React, { useState } from 'react';
import './Navbarstyle.css';
import Sign_up_in from './Sign_up_in';

const Navbar = ({ setIsModalOpen, isLoggedIn, setIsLoggedIn }) => {
  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false); // Log out the user
    } else {
      setIsModalOpen(true); // Open the modal when 'Log In' is clicked
    }
  };

  return (
    <div>
      <nav className="Nav-Bar">
        <h1 className="trip-logo">Travelify</h1>
        <ul className="Nav-Menu">
          <li><i className="fa-solid fa-house"></i> Home</li>
          <li onClick={scrollToAbout}><i className="fa-solid fa-address-card"></i> About Us</li>
          <li onClick={scrollToContact}><i className="fa-solid fa-address-book"></i> Contact Us</li>
          <li 
            className={`Log-in ${isLoggedIn ? 'logout' : ''}`} 
            onClick={handleAuthClick}
          >
            <i className={isLoggedIn ? "fa-solid fa-right-from-bracket" : "fa-solid fa-right-to-bracket"}></i>
            {isLoggedIn ? "Log Out" : "Log In"}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

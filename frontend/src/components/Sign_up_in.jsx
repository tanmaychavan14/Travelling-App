import React, { useState } from 'react';
import './Sign_up_in.css';

const Sign_up_in = ({ onClose, setIsLoggedIn }) => {
  const [isSignUpActive, setSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setSignUpActive(true);
  };

  const handleSignInClick = () => {
    setSignUpActive(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate successful login by setting the logged-in state
    setIsLoggedIn(true);
    onClose(); // Close the modal after login
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Simulate successful sign-up by setting the logged-in state
    setIsLoggedIn(true);
    onClose(); // Close the modal after sign-up
  };

  return (
    <div className={`container ${isSignUpActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to stay connected</p>
            <button className="hidden" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey with us</p>
            <button className="hidden" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign_up_in;

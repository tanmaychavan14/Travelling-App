import React, { useState } from 'react';
import './Sign_up_in.css';
import axios from 'axios';

const Signupin = ({ onClose, setIsLoggedIn }) => {
  const [isSignUpActive, setSignUpActive] = useState(true);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignUpClick = () => {
    setSignUpActive(true);
  };

  const handleSignInClick = () => {
    setSignUpActive(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const response = await axios.post('https://travelling-app-chi.vercel.app/login', loginData, { withCredentials: true });
      if (response.status === 200) {
        alert("Login successful!");
        setIsLoggedIn(true);  // This triggers the state change to show the home page
        onClose();  // Close the login/sign-up modal if needed
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log("Error during login:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!registrationData.name || !registrationData.email || !registrationData.password) {
      alert("Please fill in all the fields.");
      return;
    }
  
    try {
      // Make the POST request using fetch
      const response = await fetch('https://travelling-app-chi.vercel.app/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData), // Send the registration data as a JSON string
        credentials: 'include', // Include cookies with the request (same as withCredentials: true in axios)
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      // Check if the response status is 200 (success)
      if (response.ok) {
        alert("Registration successful!");
        setSignUpActive(false); // Deactivate the sign-up form or navigate to another page
      } else {
        alert(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      // Handle errors during registration
      console.log("not goint to backend")
      console.error("Error during registration:", error);
      alert("Error during registration. Please try again.");
    }
  
    // Clear registration form data after attempting registration
    setRegistrationData({
      name: "",
      email: "",
      password: ""
    });
  };
  

  return (
    <div className={`container ${isSignUpActive ? 'active' : ''}`} id="container">
      {/* Sign-Up Form */}
      {isSignUpActive ? (
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={registrationData.name}
              onChange={handleRegistrationChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={registrationData.email}
              onChange={handleRegistrationChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={registrationData.password}
              onChange={handleRegistrationChange}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      ) : (
        <div className="form-container sign-in">
          {/* Sign-In Form */}
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      )}

      {/* Toggle Between Sign-Up and Sign-In */}
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

export default Signupin;

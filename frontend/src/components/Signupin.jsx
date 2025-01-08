import React, { useState } from 'react';
import './Sign_up_in.css';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
        const response = await axios.post(
            `${BACKEND_URL}login`,
            loginData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.status === 200) {
         
            setIsLoggedIn(true);
            onClose();
        }
    } catch (error) {
        console.error("Login error:", error);
        alert(error.response?.data?.message || "Login failed");
    }
};

const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            `${BACKEND_URL}registration`,
            registrationData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.status === 200) {
           
            alert("Registration successful!");
            setSignUpActive(false);
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.message || "Registration failed");
    }
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

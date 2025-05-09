import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css'; // Use HomePage.css for consistency

const API_URL = 'https://asha-ai-bot-backend.herokuapp.com'; // Replace with your Heroku app URL

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const response = await fetch(`${API_URL}/users/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // Parse the response body

      if (response.ok) {
        setStatus('Signup successful! Redirecting...');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus(responseData.error || 'Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setStatus(`Error signing up: ${error.message}. Please try again later or contact support@asha.ai.`);
    }
  };

  return (
    <div className="asha-ai-bot">
      <header className="header">
        <h1>ASHA AI BOT</h1>
        <nav>
          <Link to="/">Home</Link>
          <button type="button" className="link-button">Share</button>
          <Link to="/contact">Contact</Link>
          <div className="user-icon" role="button" aria-label="User Profile">
            👤
          </div>
        </nav>
      </header>
      <div className="main-container">
        <aside className="sidebar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recent-chats">Recent Chats</Link></li>
            <li><Link to="/job-opportunities">Job Opportunities</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/mentorship">Mentorship</Link></li>
            <li><Link to="/women-empowerment">Women Empowerment</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/privacy">Privacy & Security</Link></li>
            <li><Link to="/feedback">Feedback & Analytics</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
        </aside>
        <section className="chat-section">
          <h2>Sign Up</h2>
          <div className="signup-form-container">
            <form onSubmit={handleSubmit} className="chat-input signup-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                required
              />
              <button type="submit" className="send-button">
                <span role="img" aria-label="Sign Up">🚀</span> Sign Up
              </button>
            </form>
            {status && <p className={status.includes('Error') || status.includes('Failed') ? 'error' : 'success'}>{status}</p>}
          </div>
        </section>
        <aside className="faq-section">
          <h2>FAQ</h2>
          <button className="faq-button" onClick={() => alert('Signup FAQ: Ensure all fields are filled!')}>
            How do I sign up?
          </button>
          <button className="faq-button" onClick={() => alert('Signup FAQ: Contact support for help!')}>
            What if I forget my password?
          </button>
        </aside>
      </div>
    </div>
  );
};

export default SignupPage;
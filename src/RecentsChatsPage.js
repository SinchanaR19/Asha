import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RecentChatPage.css';

const API_URL = 'https://asha-ai-bot-backend.herokuapp.com';

const RecentChatsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch recent chat sessions on component mount
  useEffect(() => {
    const fetchRecentChats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/chatbot/recent-chats/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication token if required
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recent chats: ${response.statusText}`);
        }

        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
        toast.error('Failed to load recent chats. Please try again or contact support@asha.ai.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentChats();
  }, []);

  // Handle clicking on a chat session to view it
  const handleSessionClick = (sessionId) => {
    navigate('/', { state: { sessionId } }); // Redirect to HomePage with sessionId
  };

  return (
    <div className="recent-chats-page">
      <ToastContainer />
      <header className="header">
        <h1>ASHA AI BOT</h1>
        <nav>
          <a href="/signup">Sign Up</a>
          <button type="button" className="link-button">Share</button>
          <a href="/contact">Contact</a>
          <div className="user-icon" role="button" aria-label="User Profile">
            👤
          </div>
        </nav>
      </header>
      <div className="main-container">
        <aside className="sidebar">
          <ul>
          <li><a href="/">Home</a></li>
            <li><Link to="/recent-chats">Recent Chats</Link></li>
            <li><Link to="/job-oppurtunity">Job Opportunities</Link></li>
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
        <section className="recent-chats-section">
          <h2>Recent Chats</h2>
          {loading ? (
            <div>Loading...</div>
          ) : sessions.length === 0 ? (
            <div>No recent chats found.</div>
          ) : (
            <ul className="chat-list">
              {sessions.map((session) => (
                <li
                  key={session.session_id}
                  className="chat-item"
                  onClick={() => handleSessionClick(session.session_id)}
                >
                  <div className="chat-info">
                    <div className="chat-session-id">Session: {session.session_id}</div>
                    <div className="chat-timestamp">
                      Last Message: {new Date(session.last_message_time).toLocaleString()}
                    </div>
                    <div className="chat-preview">
                      {session.last_message ? session.last_message : 'No messages yet'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecentChatsPage;
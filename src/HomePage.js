import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';
import { Link } from 'react-router-dom';

const API_URL = 'https://asha-ai-bot-backend.herokuapp.com';

// Mock data for job listings and events (replace with actual API calls)
const mockJobListings = [
  { id: 1, title: 'Software Engineer', company: 'Tech Corp', description: 'A role open to all genders.' },
  { id: 2, title: 'Data Scientist', company: 'Data Inc', description: 'Inclusive team, women encouraged to apply.' },
];

const mockEvents = [
  { id: 1, name: 'Women in Tech Summit', date: '2025-06-01', description: 'Empowering women in technology.' },
];

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [jobListings, setJobListings] = useState(mockJobListings);
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Initialize session and welcome message
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    setSessionId(newSessionId);
    setMessages([
      {
        sender: 'bot',
        text: "Hello! I'm ASHA AI Bot. I can help with jobs, events, mentorships, or FAQs. What are you looking for?",
      },
    ]);

    // Fetch FAQs from the backend
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_URL}/faq/faqs/`);
        if (!res.ok) throw new Error(`Failed to fetch FAQs: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('Fetched FAQs:', data); // Log the fetched FAQs
        setFaqs(data); // Data includes id, question, answer, created_at, updated_at
      } catch (error) {
        console.error('FAQ fetch error:', error);
        toast.error('Failed to load FAQs. Contact support@asha.ai for assistance.');
        setFaqs([]); // Set to empty array if fetch fails
      }
    };

    fetchFaqs();
  }, []);

  // Simulate real-time updates for job listings and events
  useEffect(() => {
    const updateData = async () => {
      // Placeholder for real API calls
      setJobListings(mockJobListings); // Replace with actual fetch
      setEvents(mockEvents); // Replace with actual fetch
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Scroll to the bottom of the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Simple bias detection (keyword-based)
  const detectBias = (messageText) => {
    const biasedTerms = ['men only', 'women only', 'male only', 'female only'];
    return biasedTerms.some((term) => messageText.toLowerCase().includes(term));
  };

  // Send message with bias detection and FAQ matching
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Bias detection
    if (detectBias(messageText)) {
      const botMessage = {
        sender: 'bot',
        text: 'I noticed your query might contain biased language. Let’s focus on inclusive opportunities! For example, here’s a job listing open to all: ' +
              `${jobListings[0].title} at ${jobListings[0].company}.`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    }

    // Check if the user's message matches any FAQ question
    const lowerCaseMessage = messageText.toLowerCase().trim();
    console.log('User query (lowercase):', lowerCaseMessage); // Log the user query
    console.log('Available FAQs:', faqs); // Log the available FAQs
    const matchingFaq = faqs.find((faq) => {
      const faqQuestion = faq.question.toLowerCase().trim();
      console.log(`Comparing: "${faqQuestion}" with "${lowerCaseMessage}"`); // Log each comparison
      return faqQuestion === lowerCaseMessage;
    });

    if (matchingFaq) {
      console.log('Found matching FAQ:', matchingFaq); // Log the matched FAQ
      const botMessage = { sender: 'bot', text: matchingFaq.answer };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
      return;
    } else {
      console.log('No matching FAQ found for:', lowerCaseMessage); // Log if no match is found
    }

    // If no FAQ match, fall back to the chatbot query endpoint
    try {
      const response = await fetch(`${API_URL}/chatbot/query/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend response from /chatbot/query/:', data); // Log for debugging

      let botMessageText = data.response || "I'm sorry, I couldn't process your request.";

      // Promote inclusivity for relevant queries
      if (messageText.toLowerCase().includes('job') || messageText.toLowerCase().includes('career')) {
        botMessageText += '\n\nAsha AI Bot supports women empowerment! Check out this event: ' +
                         `${events[0].name} on ${events[0].date}.`;
      }

      const botMessage = { sender: 'bot', text: botMessageText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error); // Log the error for debugging
      toast.error('Something went wrong. Please try again or contact support at support@asha.ai.');
      const fallbackMessage = {
        sender: 'bot',
        text: `I couldn’t process your request about "${messageText}". Here’s a suggestion: explore our FAQs or email support@asha.ai.`,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFaqClick = (faqQuestion) => {
    sendMessage(faqQuestion);
  };

  const handleFeedback = async (messageIndex, text, isBiasReport = false) => {
    const feedback = prompt(isBiasReport ? 'Please report any bias in this response:' : 'Please provide feedback for this response:');
    if (feedback) {
      try {
        await fetch(`${API_URL}/users/feedback/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            feedback,
            session_id: sessionId,
            isBiasReport,
          }),
        });
        toast.success('Thank you for your feedback!');
      } catch (error) {
        toast.error('Failed to submit feedback.');
      }
    }
  };

  return (
    <div className="asha-ai-bot">
      <ToastContainer />
      <header className="header">
        <h1>ASHA AI BOT</h1>
        <nav>
          <Link to="/signup">Sign Up</Link>
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
          <h2>CHAT BOT</h2>
          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.text}
                {msg.sender === 'bot' && (
                  <div className="feedback-buttons">
                    <button
                      className="feedback-button"
                      onClick={() => handleFeedback(index, msg.text)}
                      aria-label="Provide feedback"
                    >
                      Feedback
                    </button>
                    <button
                      className="feedback-button bias-report"
                      onClick={() => handleFeedback(index, msg.text, true)}
                      aria-label="Report bias"
                    >
                      Report Bias
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="message bot-message">Typing...</div>}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ASK ASHA..."
              disabled={loading}
            />
            <button type="submit" className="send-button" disabled={loading}>
              <span role="img" aria-label="Send">🚀</span>
            </button>
          </form>
        </section>
        <aside className="faq-section">
          <h2>FAQ</h2>
          {faqs.map((faq) => (
            <button
              key={faq.id}
              className="faq-button"
              onClick={() => handleFaqClick(faq.question)}
            >
              {faq.question}
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
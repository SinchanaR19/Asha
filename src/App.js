import './HomePage.css';
import HomePage from './HomePage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import RecentsChatsPage from './RecentsChatsPage';
import JobOpportunitiesPage from './JobOpportunitiesPage';
function App() {
  return (
<Router>
    <div className="App">
<Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/recent-chats" element={<RecentsChatsPage />} />
          <Route path="/job-opportunities" element={<JobOpportunitiesPage />} />
        </Routes>
    </div>
</Router>
  );
}

export default App;

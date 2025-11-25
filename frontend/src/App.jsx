import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import DashboardPage from './pages/DashboardPage';
import JobBoardPage from './pages/JobBoardPage';
import LearningHubPage from './pages/LearningHubPage';
import ResumePage from './pages/ResumePage';
import Guide from './pages/Guide';
import ProfilePage from './pages/ProfilePage';
import TestPage from './pages/TestPage';

function App() {
  const [theme, setTheme] = useState('dark');
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSessionSwitch = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
        onSessionSwitch={handleSessionSwitch}
        currentSessionId={currentSessionId}
      >
        <Routes>
          <Route path="/" element={<ChatInterface sessionId={currentSessionId} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobBoardPage />} />
          <Route path="/learning" element={<LearningHubPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

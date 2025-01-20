import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';  
import AboutPage from './AboutPage'; 
import LoginSignupPage from './LoginSignupPage';
import Dashboard from './DashboardPage';
import TestPage from './TestPage';
import TrackerPage from './TrackerPage';
import NotesPage from './NotesPage';
import TestCreator from './CreateTestPage';

function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="about" element={<AboutPage />} /> 
          <Route path="login" element={<LoginSignupPage />} /> 
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/tracker" element={<TrackerPage/>} />
          <Route path="/notes" element={<NotesPage/>} />
          <Route path="/create" element={<TestCreator/>} />
        </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';  // Make sure to import your HomePage component
import AboutPage from './AboutPage'; // Make sure to import your AboutPage component
import LoginSignupPage from './LoginSignupPage';
import Dashboard from './DashboardPage';
import TestPage from './TestPage';

function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Route for HomePage */}
          <Route path="about" element={<AboutPage />} /> {/* Route for AboutPage */}
          <Route path="login" element={<LoginSignupPage />} /> 
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="/test/:testId" element={<TestPage />} />
        </Routes>
    </Router>
  );
}

export default App;

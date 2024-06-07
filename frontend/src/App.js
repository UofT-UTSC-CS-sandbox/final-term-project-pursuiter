import './App.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import LoginPage from './components/login-page/LoginPage';
import SignupPage from './components/signup-page/SignupPage';
import ApplicantDashboard from './components/applicant-dashboard/ApplicantDashboard';
import RecruiterDashboard from './components/recruiter-dashboard/RecruiterDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
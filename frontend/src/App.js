import "./App.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LandingPage from "./components/landing-page/LandingPage";
import LoginPage from "./components/login-page/LoginPage";
import JobSeekerSignupPage from "./components/applicant-signup-page/ApplicantSignupPage";
import RecruiterSignupPage from "./components/recruiter-signup-page/RecruiterSignupPage";
import ApplicantDashboard from "./components/applicant-dashboard/ApplicantDashboard";
import RecruiterDashboard from "./components/recruiter-dashboard/RecruiterDashboard";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/applicant-signup" element={<JobSeekerSignupPage />} />
          <Route path="/recruiter-signup" element={<RecruiterSignupPage />} />
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

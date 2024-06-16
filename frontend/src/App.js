import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LandingPage from "./components/landing-page/LandingPage";
import LoginPage from "./components/users/LoginPage";
import JobSeekerSignupPage from "./components/users/ApplicantSignupPage";
import RecruiterSignupPage from "./components/users/RecruiterSignupPage";
import ApplicantDashboard from "./components/dashboards/ApplicantDashboard";
import RecruiterDashboard from "./components/dashboards/RecruiterDashboard";
import UserInformation from "./components/users/UserInformation";
import ApplicantList from "./components/dashboards/ApplicantList";
import NavBar from "./components/nav-bar/NavBar";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/applicant-signup" element={<JobSeekerSignupPage />} />
          <Route path="/recruiter-signup" element={<RecruiterSignupPage />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          <Route path="/user-information" element={<UserInformation />} />
          <Route path="/applicants/:jobId" element={<ApplicantList />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

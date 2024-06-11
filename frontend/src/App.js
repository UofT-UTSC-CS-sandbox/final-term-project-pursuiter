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
<<<<<<< HEAD
<<<<<<< HEAD
import JobSeekerInformation from "./components/applicant-information/ApplicantInformation";
=======
import ApplicantJobs from "./components/applicant-jobs/ApplicantJobs";
>>>>>>> 42b6b3c (show jobs all jobs on jobs page)
=======
// import ApplicantJobs from "./components/applicant-jobs/ApplicantJobs";
>>>>>>> 422190c (changed the file location)

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/applicant-signup" element={<JobSeekerSignupPage />} />
          <Route path="/recruiter-signup" element={<RecruiterSignupPage />} />
<<<<<<< HEAD
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

          {/* <Route path="/applicant-jobs" element={<ApplicantJobs />} /> */}
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
<<<<<<< HEAD
          <Route path="/applicant-information" element={<JobSeekerInformation />} />          
=======
          <Route path="/applicant-jobs" element={<ApplicantJobs />} />
>>>>>>> 42b6b3c (show jobs all jobs on jobs page)
=======
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />

          {/* <Route path="/applicant-jobs" element={<ApplicantJobs />} /> */}
          <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
>>>>>>> 422190c (changed the file location)
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

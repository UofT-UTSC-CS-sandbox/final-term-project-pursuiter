import "./LandingPage.css";

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const handleJobSeeker = () => {
    navigate("/applicant-signup");
  };

  const handleRecruiter = () => {
    navigate("/recruiter-signup");
  };

  return (
    <div className="landing-page-container">
      <div className="content-container">
        <div className="column-left">
          <h1>Find a job you love.</h1>
          <p className="left-paragraph">
            Take full advantage of our advanced job matching system and AI
            powered application recommendations. Your dream job is just a few
            clicks away.
          </p>
          <button onClick={handleJobSeeker} className="landing-page-button">
            Join as Job-Seeker
          </button>
        </div>
        <div className="column-right">
          <h1>Attract. Select. Grow.</h1>
          <p className="right-paragraph">
            Tired of applicants that dont match your postings? Not with us.
            Pursuiter makes sure your postings get only the best candidates and
            helps filter them using AI.
          </p>
          <button onClick={handleRecruiter} className="landing-page-button">
            Join as Recruiter
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

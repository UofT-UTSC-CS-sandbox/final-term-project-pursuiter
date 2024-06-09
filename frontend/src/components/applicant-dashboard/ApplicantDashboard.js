import "./ApplicantDashboard.css";

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

function ApplicantDashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div>
      <h1>Applicant Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.fullName}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <div>
        <Link to="/applicant-information">Personal Information</Link>
      </div>      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ApplicantDashboard;

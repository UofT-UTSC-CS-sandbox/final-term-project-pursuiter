import "./RecruiterDashboard.css";

import React from "react";
import { useNavigate } from "react-router-dom";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default RecruiterDashboard;

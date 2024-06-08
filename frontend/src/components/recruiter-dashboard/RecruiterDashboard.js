import "./RecruiterDashboard.css";

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.fullName}</p>
          <p>Company: {user.companyName}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default RecruiterDashboard;

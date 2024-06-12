import "./ApplicantInformation.css";

import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function JobSeekerInformation() {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState("Personal Details");
  const [fullName, setFullName] = useState(user.fullName);
  const [address, setAddress] = useState(user.address);
  const [email] = useState(user.email);
  const [newEmail, setNewEmail] = useState(user.email);
  const [positions, setPositions] = useState(user.positions);
  const [companyName, setCompanyName] = useState(user.companyName);
  const [userType] = useState(user.userType);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatingUser = await updateUser(
        email,
        newEmail,
        fullName,
        address,
        positions,
        companyName,
        userType
      );
      console.log("Personal information update successful", updatingUser);
      alert("Personal information update successful!");
    } catch (error) {
      console.error("Personal information update failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="ApplicantInformation">
      <header className="dashboard-header">
        <div className="logo-container">  
              <img src="https://via.placeholder.com/20" alt="logo" className="logo-image" />
              <div className="logo">PERSUITER</div>
        </div>
        <div className="header-links">
            <div className="header-link" onClick={() => navigate("/applicant-dashboard")}>Jobs</div>
            <div className="header-link" onClick={() => navigate("/applicant-information")}>ACCOUNT</div>
            <div className="header-link" onClick={handleLogout}>LOGOUT</div>
        </div>
      </header>
    <div className="page-container">
      <div className="profile-card">
        <div className="sidebar">
          <div className="profile-picture"></div>
          <div className="profile-name">
            <h1>{user.fullName}</h1>
          </div>
          {userType === "applicant" ? (
            <div className="menu-container">
              <button
              className={`menu-item ${
                activeMenu === "Personal Details" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("Personal Details")}
            >
              Personal Details
            </button>
            <button
              className={`menu-item ${activeMenu === "Files" ? "active" : ""}`}
              onClick={() => setActiveMenu("Files")}
            >
              Files
            </button>
            <button
              className={`menu-item ${
                activeMenu === "Applications" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("Applications")}
            >
              Applications
            </button>
            </div>
          ) : (
            <div className="menu-container">
              <button
              className={`menu-item ${
                activeMenu === "Personal Details" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("Personal Details")}
            >
              Personal Details
            </button>
            </div>
          )}
        </div>
        <div className="main-content">
          <div className="header-container">
            <h2>Personal Information</h2>
            <button className="sign-out-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            {userType === "applicant" ? (
              <div className="form-group">
                <label htmlFor="positions">Positions wanted:</label>
                <input
                type="text"
                id="positions"
                name="positions"
                placeholder="Separate using commas. Eg: Software Engineer, Data Analyst"
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                required
                />
              </div>
          ) : (
            <div className="form-group">
              <label htmlFor="companyName">Company:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}
            <button type="submit" className="save-button">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default JobSeekerInformation;

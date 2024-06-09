import "./ApplicantInformation.css";

import React, { useState } from "react";

function JobSeekerInformation() {
  const [activeMenu, setActiveMenu] = useState("Personal Details");

  return (
  <div className="page-container">
    <div className="profile-card">
      <div className="sidebar">
        <div className="profile-picture"></div>
        <div className="profile-name">
          <h1>John Doe</h1>
        </div>
        <button 
          className={`menu-item ${activeMenu === "Personal Details" ? "active" : ""}`} 
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
          className={`menu-item ${activeMenu === "Applications" ? "active" : ""}`} 
          onClick={() => setActiveMenu("Applications")}
        >
        Applications
        </button>
      </div>
      <div className="main-content">
        <div className="header-container">
          <h2>Personal Information</h2>
          <button className="sign-out-button">Sign Out</button>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input 
            type="text" 
            id="name" 
            name="name" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" >Address:</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" >Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="positions" >Positions wanted:</label>
            <input 
              type="text" 
              id="positions" 
              name="positions" 
              placeholder="Seperate using commas. Eg: Software Engineer, Data Analyst" 
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </div>
  </div>
);
}

export default JobSeekerInformation;

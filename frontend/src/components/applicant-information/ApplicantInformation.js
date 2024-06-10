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
        positions      
      );
      console.log("Personal information update successful", updatingUser);
      alert("Personal information update successful!");
    } catch (error) {
      console.error("Personal information update failed:", error);
      alert(error.message);
    }
  };

  return (
  <div className="page-container">
    <div className="profile-card">
      <div className="sidebar">
        <div className="profile-picture"></div>
        <div className="profile-name">
          <h1>{user.fullName}</h1>
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
          <button className="sign-out-button" onClick={handleLogout}>Sign Out</button>
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
            <label htmlFor="address" >Address:</label>
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
            <label htmlFor="email" >Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} 
              required             
            />
          </div>
          <div className="form-group">
            <label htmlFor="positions" >Positions wanted:</label>
            <input 
              type="text" 
              id="positions" 
              name="positions" 
              placeholder="Seperate using commas. Eg: Software Engineer, Data Analyst" 
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
              required 
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

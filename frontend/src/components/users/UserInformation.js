import "./Users.css";

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function UserInformation() {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState("Personal Details");

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [positions, setPositions] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setAddress(user.address || "");
      setEmail(user.email || "");
      setNewEmail(user.email || "");
      setPositions(user.positions || "");
      setCompanyName(user.companyName || "");
      setUserType(user.userType || "");
      setUserId(user._id || "");
    }
  }, [user]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // Handle update info form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Updating user with:", {
        email,
        newEmail,
        fullName,
        address,
        positions,
        companyName,
        userType,
        userId,
      });
      const updatingUser = await updateUser({
        email,
        newEmail,
        fullName,
        address,
        positions,
        companyName,
        userType,
        userId,
      });
      alert("Personal information update successful!");
    } catch (error) {
      console.error("Personal information update failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="users-page-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img
            src="https://via.placeholder.com/20"
            alt="logo"
            className="logo-image"
          />
          <div className="logo">PERSUITER</div>
        </div>
        <div className="header-links">
          {userType === "applicant" ? (
            <div
              className="header-link"
              onClick={() => navigate("/applicant-dashboard")}
            >
              Jobs
            </div>
          ) : (
            <div
              className="header-link"
              onClick={() => navigate("/recruiter-dashboard")}
            >
              Postings
            </div>
          )}
          <div
            className="header-link"
            onClick={() => navigate("/user-information")}
          >
            ACCOUNT
          </div>
          <div className="header-link" onClick={handleLogout}>
            LOGOUT
          </div>
        </div>
      </header>
      <div className="users-container users-info-container">
            <h1>Personal Information</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              {userType === "applicant" ? (
                <div>
                  <label>Positions Wanted:</label>
                  <input
                    type="text"
                    name="positions"
                    placeholder="Separate using commas. Eg: Software Engineer, Data Analyst"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label>Company</label>
                  <input
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
  );
}

export default UserInformation;
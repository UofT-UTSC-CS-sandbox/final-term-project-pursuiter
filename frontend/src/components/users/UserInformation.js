<<<<<<< HEAD
import "../../App.css";
=======
>>>>>>> main
import "./Users.css";

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import Modal from "../modal/Modal";
import UserController from "../../controllers/UserController";
=======
>>>>>>> main

function UserInformation() {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useContext(UserContext);
<<<<<<< HEAD
=======
  const [activeMenu, setActiveMenu] = useState("Personal Details");
>>>>>>> main

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [positions, setPositions] = useState("");
  const [companyName, setCompanyName] = useState("");
<<<<<<< HEAD
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [userType, setUserType] = useState("");
  const [showFileForm, setShowFileForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

  // fetch user information
  useEffect(() => {
    if (user) {
      UserController.fetchUserInformation(user.userId)
        .then((userInfo) => {
          setFullName(userInfo.fullName || "");
          setAddress(userInfo.address || "");
          setNewEmail(userInfo.email || "");
          setPositions(userInfo.positions || "");
          setCompanyName(userInfo.companyName || "");
          setUserType(userInfo.userType || "");
          setSelectedResume(userInfo.masterResume || null);
          setIsFileSelected(true);
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
        });
    }
  }, [user]);

  // handle form submission
  const handleSubmit = async (e) => {
    if (!isFileSelected) {
      e.preventDefault();
      alert("Please select a file before submitting.");
      return;
    }

    e.preventDefault();
    const updatedUser = {
      email: user.email,
      newEmail,
      fullName,
      address,
      positions,
      companyName,
      userType,
      userId: user.userId,
      masterResume: resumeFile,
    };
    try {
      const updatedUserInfo = await UserController.updateUser(updatedUser);
      setFullName(updatedUserInfo.fullName);
      setAddress(updatedUserInfo.address);
      setNewEmail(updatedUserInfo.email);
      setPositions(updatedUserInfo.positions);
      setCompanyName(updatedUserInfo.companyName);
      setUserType(updatedUserInfo.userType);
      setSelectedResume(updatedUserInfo.masterResume);
      setShowFileForm(false);
      setShowConfirmation(true);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Failed to update user information.");
    }
  };

  // handle master resume change
  const handleMasterResumeChange = (event) => {
    const file = event.target.files[0];
    setIsFileSelected(file);
    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="users-information-wrapper">
      <div className="users-page-container">
        <div className="users-container account-page">
          <div className="aesthetic-bar-users"></div>
          <div className="users-info-container">
            <form onSubmit={handleSubmit}>
              <div className="users-header users-info-header">
                <h1>Personal Information</h1>
                <button type="submit">Save</button>
              </div>
              <div className="users-form-group users-info-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="users-form-group users-info-form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="users-form-group users-info-form-group">
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
                <div className="users-form-group users-info-form-group">
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
                <div className="users-form-group users-info-form-group">
                  <label>Company:</label>
                  <input
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}
            </form>

            {userType === "applicant" && (
              <div>
                <div className="users-header users-info-header">
                  <div className="master-resume-header">
                    <h1>Master Resume</h1>
                    <span className="tooltip-container">
                      <span className="tooltip-icon">?</span>
                      <span className="tooltip tooltip-users">
                        Your eligibility for job applications may be affected by
                        this resume. Please ensure it is up-to-date and includes
                        all your qualifications.
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowFileForm(true);
                      setIsFileSelected(false);
                    }}
                  >
                    Add File
                  </button>
                </div>
                <div className="users-header users-info-header">
                  {selectedResume ? (
                    <iframe
                      src={selectedResume}
                      className="resume-iframe"
                      title="Resume"
                    ></iframe>
                  ) : (
                    "Resume not available"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Modal
          show={showFileForm}
          onClose={() => setShowFileForm(false)}
          title={editMode ? "Edit File" : "New File"}
        >
          <form className="new-item-form" onSubmit={handleSubmit}>
            <p>Upload Resume: </p>
            <input
              type="file"
              accept=".pdf"
              onChange={(event) => handleMasterResumeChange(event, "resume")}
            />
            <button
              type="submit"
              className="submit-button"
              disabled={!isFileSelected}
            >
              {editMode ? "Update File" : "Submit"}
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                setShowFileForm(false);
                setIsFileSelected(true);
                setResumeFile(null);
              }}
            >
              Cancel
            </button>
          </form>
        </Modal>
        <Modal
          show={showConfirmation}
          onClose={() => setShowConfirmation(false)}
        >
          <p>User information updated successfully!</p>
        </Modal>
=======
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

  // Handle update info form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
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
      <div className="users-container users-info-container">
        <form onSubmit={handleSubmit}>
          <div className="users-header users-info-header">
            <h1>Personal Information</h1>
            <button type="submit">Save</button>
          </div>
          <div className="users-from-group users-info-form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="users-from-group users-info-form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="users-from-group users-info-form-group">
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
            <div className="users-from-group users-info-form-group">
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
            <div className="users-from-group users-info-form-group">
              <label>Company:</label>
              <input
                type="text"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}
        </form>
>>>>>>> main
      </div>
    </div>
  );
}

export default UserInformation;

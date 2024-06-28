import "./Users.css";

import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";
import UserController from "../../controllers/UserController";

function UserInformation() {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useContext(UserContext);
  // const {updateMasterResume } = useContext(UserContext);
  // const [activeMenu, setActiveMenu] = useState("Personal Details");

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [positions, setPositions] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [masterResume, setMasterResume] = useState("");
  const [selectedResume, setSelectedResume] = useState("");

  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");

  const [showFileForm, setShowFileForm] = useState(false);
  const [editMode, setEditMode] = useState(false);


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
      // setMasterResume(user.masterResume);
      // setSelectedResume(user.masterResume);
    }
  }, [user]);

  // Handle update info form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowFileForm(false);

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
        masterResume,
      });
      setSelectedResume(masterResume);
      alert("Updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.message);
    }
  };

  // Handle file change for master resume
  const handleMasterResumeChange = (event, fileType) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (fileType === "resume") {
        setMasterResume(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="users-page-container">
      <style>{`body { background-color:#E7E7E7;}`}</style>
      <div className="users-container account-page"> 
        <div className="header"><h1>Account</h1></div>
        <div className="aesthetic-bar-users"></div>
        <div className="users-info-container">
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
          
          {userType === "applicant" && (
              <div>
                  <div className="users-header users-info-header">
                      <h1>Master Resume</h1>
                      <button onClick={() => { 
                                              
                                              setShowFileForm(true)
                                              }
                                              }>Add File</button>
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
          <button type="submit">
            {editMode ? "Update File" : "Submit"}
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowFileForm(false)}
          >
            Cancel
          </button>
        </form>
      </Modal>
      
    </div>
  );
}

export default UserInformation;

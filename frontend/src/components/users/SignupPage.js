import "./Users.css";

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import UserController from "../../controllers/UserController";
import { GoogleLogin } from '@react-oauth/google';
import Modal from "../modal/Modal";
import "../modal/Modal.css";

function SignupPage({ userType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAccessCode, setCompanyAccessCode] = useState("");
  const [address] = useState("");
  const [positions] = useState("");
  const navigate = useNavigate();
  const { loginUser, googleSignup, googleLogin } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const heading =
    userType === "applicant"
      ? "Create Job-Seeker Account"
      : "Create Recruiter Account";

  // Handle signup form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await UserController.signupUser({
        userType,
        email,
        password,
        fullName,
        companyName,
        companyAccessCode,
        address,
        positions,
      });

      alert("Signup successful!");

      await loginUser(email, password);

      if (userType === "applicant") {
        navigate("/applicant-dashboard");
      } else if (userType === "recruiter") {
        navigate("/recruiter-dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async (response) => {
    try {
      const idToken = response.credential;
      setIdToken(idToken);
      const user = await googleSignup(idToken, userType);

      setGoogleUser(user);
      if (userType === "recruiter") {
        console.log(user.message);
        if (user.message === "User already exists, please log in.") {
          await googleLogin(idToken);
          navigate("/recruiter-dashboard");
        } else {
          setShowModal(true);
        }
      } else {
        await googleLogin(idToken);
        if (user.message !== "User already exists, please log in.") {
          alert("Signup successful!");
        }
        navigate("/applicant-dashboard");
      }
    } catch (error) {
      console.error("Google Signup failed:", error);
      alert(error.message);
    }
  };

// Handle submission from the modal
const handleModalSubmit = async (event) => {
  event.preventDefault();
  try {
        await UserController.verifyAccessCode(companyName, companyAccessCode)

        const user = await UserController.updateUser({
          ...googleUser,
          companyName,
          companyAccessCode,
        });
        setGoogleUser(user);
        await googleLogin(idToken);
        alert("Signup successful!");
        navigate("/recruiter-dashboard");
  } catch (error) {
    await UserController.deleteUser(googleUser.userId);
    console.error("Company details update failed:", error);
    alert("Invalid access code. Please try again.");
  }
};


  return (
    <div className="users-page-container">
      <h1 className="logo">PURSUITER</h1>
      <div className="users-container">
        <h1>{heading}</h1>
        <form onSubmit={handleSubmit}>
          <div className="users-form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="users-form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="users-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {userType === "recruiter" && (
            <>
              <div className="users-form-group">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="users-form-group">
                <label>Company Access Code:</label>
                <input
                  type="text"
                  value={companyAccessCode}
                  onChange={(e) => setCompanyAccessCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="users-form-submission">
            <button type="submit">Sign Up</button>
            <span>OR</span>
            <GoogleLogin onSuccess={handleGoogleSignup} onError={() => alert('Google Signup Failed')} />
          </div>
        </form>
        <div className="inline-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          {userType === "recruiter" ? (
            <div className="inline-link">
              <p>
                Are you a job-seeker?{" "}
                <Link to="/applicant-signup">Create a Job-Seeker Account</Link>
              </p>
            </div>
          ) : (
            <div className="inline-link">
              <p>
                Are you a recruiter?{" "}
                <Link to="/recruiter-signup">Create a Recruiter Account</Link>
              </p>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
      <div className="modal-header">
        <div>Hello&nbsp;</div> 
        <div className='modal-name'>{googleUser?.fullName}</div>
        <div>!</div>
      </div>
      <p className="modal-description">Please provide your company details.</p>
      <form className="new-item-form">
            <input
              type="text"
              name="companeName"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <input
              type="text"
              name="companyAccessCode"
              placeholder="Company Access Code"
              value={companyAccessCode}
              onChange={(e) => setCompanyAccessCode(e.target.value)}
              required
            />
          <button type="submit" onClick={handleModalSubmit}>Submit</button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowModal(false);
              UserController.deleteUser(googleUser.userId)
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default SignupPage;

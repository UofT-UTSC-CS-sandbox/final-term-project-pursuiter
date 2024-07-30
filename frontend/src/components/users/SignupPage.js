import "./Users.css";

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import UserController from "../../controllers/UserController";
import { GoogleLogin } from '@react-oauth/google';

function SignupPage({ userType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAccessCode, setCompanyAccessCode] = useState("");
  const [address] = useState("");
  const [positions] = useState("");
  const navigate = useNavigate();
  const { loginUser, googleSignup } = useContext(UserContext);

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
      const user = await googleSignup(idToken, userType);

      alert("Signup successful!");
      if (user.userType === "applicant") {
        navigate("/applicant-dashboard");
      } else if (user.userType === "recruiter") {
        navigate("/recruiter-dashboard");
      }
    } catch (error) {
      console.error("Google Signup failed:", error);
      alert(error.message);
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
            <><div className="users-form-group">
              <label>Company Name:</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required />
            </div><div className="users-form-group">
                <label>Company Access Code:</label>
                <input
                  type="text"
                  value={companyAccessCode}
                  onChange={(e) => setCompanyAccessCode(e.target.value)}
                  required />
              </div></>            
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
    </div>
  );
}

export default SignupPage;

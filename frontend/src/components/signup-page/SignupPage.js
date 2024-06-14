import "../Users.css";
import "./SignupPage.css";

import UserController from "../../controllers/UserController";
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

function SignupPage({ userType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address] = useState("");
  const [positions] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const heading =
    userType === "applicant"
      ? "Create Job-Seeker Account"
      : "Create Recruiter Account";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await UserController.signupUser(
        userType,
        email,
        password,
        fullName,
        companyName,
        address,
        positions,
      );
      console.log("Signup successful", user);
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

  return (
    <div className="users-page-container">
      <div className="users-header">
        <h1 className="pursuiter-heading">PURSUITER</h1>
      </div>
      <div className="users-container">
        <h1>{heading}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {userType === "recruiter" && (
            <div>
              <label>Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">Sign Up</button>
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

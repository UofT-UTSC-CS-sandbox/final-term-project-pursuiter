import "./Users.css";

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import UserController from "../../controllers/UserController";

function LoginPage() {
  const [email, setEmail] = useState("");             
  const [password, setPassword] = useState("");         
  const navigate = useNavigate();                       
  const { loginUser } = useContext(UserContext);    

  // Hangle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await UserController.loginUser(email, password);

      await loginUser(email, password);

      if (user.userType === "applicant") {
        navigate("/applicant-dashboard");
      } else if (user.userType === "recruiter") {
        navigate("/recruiter-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="users-page-container">
      <div className="users-header">
        <h1 className="pursuiter-heading">PURSUITER</h1>
      </div>
      <div className="users-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="inline-link">
          <p>
            Want a job seeker account?{" "}
            <Link to="/applicant-signup">Create a Job-Seeker Account</Link>
          </p>
          <p>
            Want a recruiter account?{" "}
            <Link to="/recruiter-signup">Create a Recruiter Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
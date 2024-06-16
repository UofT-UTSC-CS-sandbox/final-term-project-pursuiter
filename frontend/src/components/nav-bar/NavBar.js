import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./NavBar.css";

const NavBar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isAuthPage = [
    "/login",
    "/applicant-signup",
    "/recruiter-signup",
  ].includes(location.pathname);

  return (
    <header className="navbar">
      <div className="logo">PURSUITER</div>
      <div className="header-links">
        {isAuthPage ? null : location.pathname === "/" ? (
          <Link className="link" to="/login">
            LOGIN
          </Link>
        ) : user.userType === "applicant" ? (
          <>
            <Link className="link" to="/applicant-dashboard">
              DASHBOARD
            </Link>
            <Link className="link" to="/user-information">
              ACCOUNT
            </Link>
            <div className="link" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        ) : (
          <>
            <Link className="link" to="/recruiter-dashboard">
              DASHBOARD
            </Link>
            <Link className="link" to="/user-information">
              ACCOUNT
            </Link>
            <div className="link" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;

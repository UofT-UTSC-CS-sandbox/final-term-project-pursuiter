import './LandingPage.css';

import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-container">
        <h1>Landing Page</h1>
        <div><Link to="/login">Login</Link></div>
        <div><Link to="/signup">Signup</Link></div>
    </div>
  );
}

export default LandingPage;
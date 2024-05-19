import './ApplicantDashboard.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicantDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div>
            <h1>Applicant Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default ApplicantDashboard;
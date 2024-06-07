import './SignupPage.css';

import UserController from '../../controllers/UserController'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('applicant');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await UserController.signupUser(username, password, userType);
            console.log('Signup successful', user);
            alert('Signup successful!');

            if (userType === 'applicant') {
                navigate('/applicant-dashboard');
            } else if (userType === 'recruiter') {
                navigate('/recruiter-dashboard');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert(error.message);
        }
    };

    return (
        <div className="signup-container">
            <h1>Signup Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>User Type:</label>
                    <input type="radio" value="applicant" checked={userType === 'applicant'} onChange={e => setUserType(e.target.value)} /> Applicant
                    <input type="radio" value="recruiter" checked={userType === 'recruiter'} onChange={e => setUserType(e.target.value)} /> Recruiter
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupPage;

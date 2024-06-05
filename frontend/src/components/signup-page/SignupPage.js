import './SignupPage.css';

import UserController from '../../controllers/UserController'; 
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage({ userType }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const navigate = useNavigate();
    const heading = userType === 'applicant' ? 'Create Job-Seeker Account' : 'Create Recruiter Account';

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await UserController.signupUser(userType, email, password, fullName, companyName);
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
            <h1>{heading}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name: </label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label>Email: </label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {userType === 'recruiter' && (
                    <div>
                        <label>Company Name: </label>
                        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                    </div>
                )}
                <button type="submit">Sign Up</button>
            </form>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default SignupPage;

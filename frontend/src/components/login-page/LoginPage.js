import './LoginPage.css';

import UserController from '../../controllers/UserController'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await UserController.loginUser(username, password);
            console.log('Login successful');
            if (user.userType === 'applicant') {
                navigate('/applicant-dashboard');
            } else if (user.userType === 'recruiter') {
                navigate('/recruiter-dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
const API_URL = 'http://localhost:4000';

async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

async function signupUser(username, password, userType) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userType }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to signup');
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export default {
    loginUser,
    signupUser,
};

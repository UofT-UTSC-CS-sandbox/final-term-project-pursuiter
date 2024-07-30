const API_URL = "http://localhost:4000";

const UserController = {
  // Login User
  loginUser: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Signup User
  signupUser: async ({
    userType,
    email,
    password,
    fullName,
    companyName,
    companyAccessCode,
    address,
    positions,
    masterResume,
    createConfirm,
  }) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType,
          email,
          password,
          fullName,
          companyName,
          companyAccessCode,
          address,
          positions,
          masterResume,
          createConfirm,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to signup");
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Google Signup
  googleSignup: async (idToken, userType) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken, userType }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to signup with Google");
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Google Login
  googleLogin: async (idToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login with Google");
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Fetch User Information
  fetchUserInformation: async (userId) => {
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error("Error fetching user information");
    }
    const userData = await response.json();
    return userData;
  },

  // Update User Information
  updateUser: async ({
    email,
    newEmail,
    fullName,
    address,
    positions,
    companyName,
    companyAccessCode,
    userType,
    userId,
    masterResume,
    createConfirm,
  }) => {
    try {
      const response = await fetch(`${API_URL}/updateUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newEmail,
          fullName,
          address,
          positions,
          companyName,
          companyAccessCode,
          userType,
          userId,
          masterResume,
          createConfirm,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update");
      }
      const user = await response.json();
      return user;
    } catch (error) {
      throw error;
    }
  },
};

export default UserController;

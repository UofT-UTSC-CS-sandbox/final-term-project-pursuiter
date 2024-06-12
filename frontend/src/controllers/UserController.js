const API_URL = "http://localhost:4000";

async function loginUser(email, password) {
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
}

async function signupUser(
  userType,
  email,
  password,
  fullName,
  companyName,
  address,
  positions
) {
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
        address,
        positions,
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
}

async function updateUser(email, newEmail, fullName, address, positions, companyName, userType) {
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
        userType,
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
}

export default {
  loginUser,
  signupUser,
  updateUser,
};

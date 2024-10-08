import React, { createContext, useState, useEffect } from "react";
import UserController from "../controllers/UserController";
import Cookies from "js-cookie";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
  });

  const [selectedTab, setSelectedTab] = useState(() => {
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    if (user) {
      return (
        Cookies.get("selectedTab") ||
        (user.userType === "applicant" ? "newJobs" : "applications")
      );
    }
    return "newJobs";
  });

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
    } else {
      Cookies.remove("user");
    }
  }, [user]);

  useEffect(() => {
    Cookies.set("selectedTab", selectedTab, { expires: 1 });
  }, [selectedTab]);

  const loginUser = async (email, password) => {
    try {
      const user = await UserController.loginUser(email, password);
      setUser(user);
      setSelectedTab(
        user.userType === "applicant" ? "newJobs" : "applications",
      );
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signupUser = async (
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
  ) => {
    try {
      const user = await UserController.signupUser(
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
      );
      setUser(user);
      setSelectedTab(userType === "applicant" ? "newJobs" : "applications");
      return user;
    } catch (error) {
      throw error;
    }
  };

  const googleSignup = async (idToken, userType) => {
    try {
      const user = await UserController.googleSignup(idToken, userType);
      setUser(user);
      setSelectedTab(user.userType === "applicant" ? "newJobs" : "applications");
      return user;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const user = await UserController.googleLogin(idToken);
      setUser(user);
      setSelectedTab(user.userType === "applicant" ? "newJobs" : "applications");
      return user;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (
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
  ) => {
    try {
      const updatedUser = await UserController.updateUser(
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
      );
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setSelectedTab(null);
    Cookies.remove("currentPage");
    Cookies.remove("itemsPerPage");
    Cookies.remove("newJobsPage");
    Cookies.remove("applicationsPage");
    Cookies.remove("user");
    Cookies.remove("selectedTab");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        selectedTab,
        setSelectedTab,
        loginUser,
        signupUser,
        googleSignup,
        googleLogin,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

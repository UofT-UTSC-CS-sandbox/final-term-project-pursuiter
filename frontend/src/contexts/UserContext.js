import React, { createContext, useState, useEffect } from 'react';
import UserController from '../controllers/UserController';
import Cookies from 'js-cookie';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  });

  useEffect(() => {
    if (user) {
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Store user data in a cookie for 7 days
    } else {
      Cookies.remove('user');
    }
  }, [user]);

  const loginUser = async (email, password) => {
    try {
      const user = await UserController.loginUser(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signupUser = async (userType, email, password, fullName, companyName) => {
    try {
      const user = await UserController.signupUser(userType, email, password, fullName, companyName);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, signupUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
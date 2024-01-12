'use client'
import React, { createContext, useContext, useState } from 'react';

// Create the context
const MyContext = createContext();

// Create a custom hook for using the context
const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContext.Provider');
  }
  return context;
};

// Create the provider component
const MyContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <MyContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, useMyContext, MyContextProvider };
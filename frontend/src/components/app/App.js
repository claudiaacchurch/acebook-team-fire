import "./App.css";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../user/SignUpForm";
import React, { useState } from "react";
import {Feed }from "../feed/Feed";
import { useNavigate, Routes, Route } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import ProfilePage from '../profilePage/ProfilePage';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar navigate = {useNavigate} />
      <Routes>
        <Route path="/posts" element={<Feed navigate={useNavigate()} />} />
        <Route path="/login" element={<LoginForm navigate={useNavigate()} />} />
        <Route path="/profile" element={<ProfilePage navigate={useNavigate()} />} />
        <Route
          path="/signup"
          element={<SignUpForm navigate={useNavigate()} />}
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;

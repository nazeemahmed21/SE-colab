import React from "react";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/landingpage.js";
import Signup from "./pages/signup.js";
import Login from "./pages/login.js"
import ProfileSetup from "./pages/profilesetup.js";
import Home from "./pages/homepage.js";
import Labs from "./pages/labs.js";
import Toolbox from "./pages/toolbox.js"
import Messages from "./pages/messages.js";
import Calendar from "./pages/calendar.js";
import Video from "./components/Video.jsx";

const Rout = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/profile-setup" element={<ProfileSetup />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/messages" element={<Messages/>}></Route>
      <Route path="/labs" element={<Labs />}></Route>
      <Route path="/toolbox" element={<Toolbox />}></Route>
      <Route path ="/calendar" element={<Calendar/>}></Route>
      <Route path="/video" element={<Video />} />
    </Routes>
  );
};

export default Rout;

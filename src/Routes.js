import React, { useContext } from "react";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/landingpage.js";
import Signup from "./pages/signup.js";
import Login from "./pages/login.js";
import ProfileSetup from "./pages/profilesetup.js";
import Home from "./pages/homepage.js";
import Labs from "./pages/labs.js";
import Toolbox from "./pages/toolbox.js";
import Messages from "./pages/messages.js";
import CalendarApp from "./components/calendarModule.js";
import Interests from "./pages/interests.js";
import Video from "./components/Video.jsx";
import { Navigate } from "react-router";
import { AuthContext } from "./Context/AuthContext.jsx";
import UserProfile from "./pages/user-Profile.js";
import LabDetails from "./pages/labDetails.js";
import LabsAnnouncements from "./pages/labsAnnouncement.js";
import VerifyEmail from "./pages/verifyEmail.js";
import Settings from "./pages/setting.js";
import FileSystem from './pages/FileSystem.js';
import Meditation1 from "./pages/meditation1.js";
import MeditationPlayer from './pages/meditationPlayer.js';
import ZenSpace from './pages/zenSpace.js';
// import medBreath from '../src/components/med_breath.js';
// import MedBreathingComponent from "./MedBreathingComponent";
import Games from './pages/games.js';

const Rout = () => {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
      <Route path="/labDetails" element={<LabDetails />} />
      <Route path="/fileSystem" element={<FileSystem />} />
      <Route path="/labAnnouncements" element={<LabsAnnouncements />} />
      <Route path="/toolbox" element={<ProtectedRoute><Toolbox /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarApp /></ProtectedRoute>} />
      <Route path="/interest" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
      <Route path="/video" element={<Video />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/user-prof" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/meditationPlayer/:title" element={<ProtectedRoute><MeditationPlayer /></ProtectedRoute>} />
      {/* <Route path="/player/:title" component={MeditationPlayer} /> */}
      <Route path="/meditation1" element={<ProtectedRoute><Meditation1 /></ProtectedRoute>} />
      <Route path="/zenSpace" element={<ProtectedRoute><ZenSpace /></ProtectedRoute>} />

      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
      <Route path="/medBreath" element={<ProtectedRoute><medBreath /></ProtectedRoute>} />

    </Routes>
  );
};

export default Rout;

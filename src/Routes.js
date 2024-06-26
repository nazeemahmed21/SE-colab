import React, { useContext } from "react";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/landingpage.js";
import Signup from "./pages/signup.js";
import Login from "./pages/login.js";
import ProfileSetup from "./pages/profilesetup.js";
import Home from "./pages/homepage.js";
import Toolbox from "./pages/toolbox.js";
import Messages from "./pages/messages.js";
import CalendarApp from "./components/calendarModule.js";
import Interests from "./pages/interests.js";
import Video from "./components/Video.jsx";
import { Navigate } from "react-router";
import { AuthContext } from "./Context/AuthContext.jsx";
import UserProfile from "./pages/user-Profile.js";
import Settings from "./pages/setting.js";
import Meditation1 from "./pages/meditation1.js";
import MeditationPlayer from './pages/meditationPlayer.js';
import ZenSpace from './pages/zenSpace.js';
import BreathingTechniquesPage from './pages/breathingTech.js';
import LabMembers from './pages/labs/labMembers.js';
import LabLayout from "./pages/labs/labLayout.js";
import LabSettings from "./pages/labs/labSettings.js";
import LabDetails from "./pages/labs/labDetails.js";
import LabsAnnouncements from "./pages/labs/labsAnnouncement.js";
import Labs from "./pages/labsHome.js";
// import medBreath from '../src/components/med_breath.js';
// import MedBreathingComponent from "./MedBreathingComponent";
import { ImageAnnotator } from "./components/ImageAnnotation.jsx";
import Thoughts from './pages/Thoughts.js';
import Todo from './pages/todopage.js';


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
      <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>}></Route>
      <Route path="/labs/:labId" element={<LabLayout />}>
        <Route index element={<LabsAnnouncements />} />
        <Route path="files" element={<LabDetails />} />
        <Route path="members" element={<LabMembers />} />
        <Route path="settings" element={<LabSettings />} />
      </Route>
      <Route path="/toolbox" element={<ProtectedRoute><Toolbox /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarApp /></ProtectedRoute>} />
      <Route path="/interest" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
      <Route path="/video" element={<Video />} />
      <Route path="/user-prof" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/meditationPlayer/:title" element={<ProtectedRoute><MeditationPlayer /></ProtectedRoute>} />
      <Route path="/meditation1" element={<ProtectedRoute><Meditation1 /></ProtectedRoute>} />
      <Route path="/zenSpace" element={<ProtectedRoute><ZenSpace /></ProtectedRoute>} />
      <Route path="/medBreath" element={<ProtectedRoute><BreathingTechniquesPage /></ProtectedRoute>} />
      <Route path="/thoughts" element={<ProtectedRoute><Thoughts /></ProtectedRoute>} />
      <Route path="/imageAnnotation" element={<ImageAnnotator />}></Route>
      <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
    </Routes>
  );
};

export default Rout;

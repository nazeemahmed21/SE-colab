import React ,{useContext} from "react";
import { Routes, Route } from "react-router";
import LandingPage from "./pages/landingpage.js";
import Signup from "./pages/signup.js";
import Login from "./pages/login.js"
import ProfileSetup from "./pages/profilesetup.js";
import Home from "./pages/homepage.js";
import Toolbox from "./pages/toolbox.js"
import Messages from "./pages/messages.js";
import Calendar from "./pages/calendar.js";
import CalendarApp from "./components/calendarModule.js";
import Interests from "./pages/interests.js";
import { Navigate } from "react-router";
import Video from "./components/Video.jsx";
import { AuthContext } from "./Context/AuthContext.jsx";
import UserProfile from "./pages/user-Profile.js";
import VerifyEmail from "./pages/verifyEmail.js";
import LabMembers from './pages/labs/labMembers.js';
import LabLayout from "./pages/labs/labLayout.js";
import LabSettings from "./pages/labs/labSettings.js";
import LabDetails from "./pages/labs/labDetails.js";
import LabsAnnouncements from "./pages/labs/labsAnnouncement.js";
import Labs from "./pages/labsHome.js";

const Rout = () => {
  const { currentUser } = useContext(AuthContext);


  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      
    }

    return children;
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/profile-setup" element={<ProfileSetup/>}  ></Route>
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
      <Route path="/messages" element={<Messages/>}></Route>
      <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>}></Route>
      <Route path="/labs/:labId" element={<LabLayout />}> 
        <Route index element={<LabDetails />} />
        <Route path="announcements" element={<LabsAnnouncements />} />
        <Route path="members" element={<LabMembers />} />
        <Route path="settings" element={<LabSettings />} />
      </Route>
      <Route path="/toolbox" element={<ProtectedRoute><Toolbox /></ProtectedRoute>}></Route>
      <Route path="/calendar" element={<ProtectedRoute><CalendarApp /></ProtectedRoute>}></Route>
      <Route path="/interest" element={<ProtectedRoute><Interests/></ProtectedRoute>}></Route>
      <Route path="/video" element={<Video />} />
      <Route path="/verify-email" element={<VerifyEmail/>} />
      <Route path="/user-prof" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
    </Routes>
  );
};

export default Rout;

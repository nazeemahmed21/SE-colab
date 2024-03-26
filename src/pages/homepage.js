import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/homepage.css";
import Popup from "../components/Popup"; // Import Popup component
import Event from "./Home";
import EventAnalytics from "./EventAnalytics";
import "../styles/eventAnalytics.css";
import { Link } from 'react-router-dom';

function Home() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const showPopup = () => {
    setPopupVisible(true);
  };
  //ewlfnwefp
  const hidePopup = () => {
    setPopupVisible(false);
  };
  return (
    <>
      <div>
        <Link to="/thoughts">
          <button className="thoughtsBtn">Go to Thoughts</button>
        </Link>
        <div className="events">
          <Event />
          <EventAnalytics />
          <br></br>
        </div>

        <div>
          <Navbar />
        </div>

        {/* Render Popup component conditionally */}
        {isPopupVisible && <Popup onClose={hidePopup} />}
      </div>
    </>
  );
}

export default Home;

//ad added
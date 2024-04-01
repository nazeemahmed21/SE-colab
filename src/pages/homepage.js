import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/homepage.css";
import Popup from "../components/Popup"; // Import Popup component
import Event from "./Home";
import "../styles/eventAnalytics.css";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Ad from "./ads.js";
import "../styles/ads.css";

function Home() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [timedPopup, setTimedPopup] = useState(false);




  useEffect(() => {
    setTimeout(() => {
      setTimedPopup(true);
    }, 6000);
  }, []);

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
         <div className="adPop">
         <Ad trigger={timedPopup} setTrigger={setTimedPopup}/>
         </div>
         <Link to="/thoughts">
          <button className="thoughtsBtn">Go to Thoughts</button>
        </Link> 
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontSize: "1.75rem",
            },
          }}
        />
        <div className="events">
          <Event />
          
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

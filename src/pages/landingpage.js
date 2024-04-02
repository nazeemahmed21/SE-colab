import React, { useState, useEffect } from "react";
import "../styles/landingpage.css";
import { useNavigate } from "react-router-dom";
import blob from "../images/blobcopy.svg";
import lp1 from "../images/lp-img-1.png";
import lp2 from "../images/lp-img-2.png";
import lplogo from "../images/logo.png";

const Landingpage = () => {
  const navigate = useNavigate();
  const words = ["Learn to Connect", "Connect to Co-lab"];
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setVisible(true);
      }, 3000); // This timeout should match the fade-out animation duration
    }, 6000); // Adjust total interval time as needed.

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="landing-p-wrapper">
      <div>
        <div>
          <h1 className="lp-main-h">Co-lab</h1>
          <h1 className={`lp-sh-1 ${visible ? "fade-in" : "fade-out"}`}>
            {words[wordIndex]}
          </h1>
          <p className="lp-desc">
            Co-lab is your virtual collaborative tool<br></br>that helps you
            empower yourself in order to<br></br>learn and connect with others.
            <br></br>
            <br></br>
            Learn to use a different set of features that will <br></br>
            help you professionally.
          </p>
        </div>
        <img src={lplogo} alt="lplogo" className="lp-logo" />
        <div className="lp-blob-img-container">
          <img src={blob} alt="blob" className="lp-blob" />
          {wordIndex === 0 && (
            <img
              src={lp2}
              alt="lp2"
              className={`lp-img-2 ${visible ? "fade-in" : "fade-out"}`}
            />
          )}
          {wordIndex === 1 && (
            <img
              src={lp1}
              alt="lp1"
              className={`lp-img-1 ${visible ? "fade-in" : "fade-out"}`}
            />
          )}
        </div>
        <div className="lp-loginandregis">
          <button
            className="landing-p-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="landing-p-register"
            onClick={() => navigate("/signup")}
          >
            Sign-Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;

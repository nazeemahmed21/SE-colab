import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { PageTitle, AppHeader, AppContent } from "../components/combinedTodo";
import styles from "../styles/todo.module.css";
import "../styles/homepage.css";
import Reminder from "../components/reminder";
import gitex from "../images/GG-show.jpg";
import art from "../images/image00009.jpg";
import Popup from "../components/Popup"; // Import Popup component
import ad2 from "../images/ad2.gif";

function Home() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };
  return (
    <>
      <div>
        <div className="events">
          <div className="event1">
            <div className="event__title">Gitex 2024</div>
            <img src={gitex} alt="GG-show" />
            <div className="event__date">
              Event Date: 14th to 18th October 2024
            </div>
            <div className="event__venue">
              Event Venue: Dubai World Trade Center
            </div>
            <div className="event__details">
              Event Details: Gitex 2024 is planned to be a global and
              technological phenomenon.
            </div>
            <button className="bob" onClick={showPopup}>
              Register
            </button>
          </div>
          <br></br>
          <div className="event3">
            <img src={ad2} alt="GG-show" />
            <div className="ad__details">Advertisement</div>
          </div>
          <br></br>
          <div className="event2">
            <div className="event__title">Dubai Art Season 2024</div>
            <img src={art} alt="GG-show" />
            <div className="event__date">
              Event Date: 12 January – 7 March 2024
            </div>
            <div className="event__venue">Event Venue: Madinat Jumeirah</div>
            <div className="event__details">
              Event Details: Dubai Art Season 2024 is planned to be a global and
              artistic phenomenon.
            </div>
            <button className="hp-reg-btn">Register</button>
          </div>
          <br></br>
        </div>
        <div>
          <Navbar />
        </div>
        <div className={styles.half}>
          <div className="container">
            <PageTitle>TO DO List</PageTitle>
            <div className={styles.app__wrapper}>
              <AppHeader />
              <AppContent />
            </div>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontSize: "1.75rem",
              },
            }}
          />
        </div>
        <Reminder />
        {/* Render Popup component conditionally */}
        {isPopupVisible && <Popup onClose={hidePopup} />}
      </div>
    </>
  );
}

export default Home;

//ad added

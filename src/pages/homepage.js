import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { PageTitle, AppHeader, AppContent } from "../components/combinedTodo";
import styles from "../styles/todo.module.css";
import "../styles/homepage.css";
import Reminder from "../components/reminder";
import Popup from "../components/Popup"; // Import Popup component
import Event from "./Home";
import EventAnalytics from "./EventAnalytics";
import "../styles/eventAnalytics.css";
import Searchbar from "./Searchbar";
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
        <div className={styles.todo_half}>
          <div className="container">
            <PageTitle>TO DO List</PageTitle>
            <div className={styles.todo_app__wrapper}>
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
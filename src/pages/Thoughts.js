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
import ThoughtsComp from "../components/ThoughtsComp";
import "../styles/thoughtscomp.css";

function Thoughts() {
  return (
    <>
      <div>
        <div >
      
      </div>
        <Link to="/home">
      <div >
        <button className="backHomebtn">Go back to Events</button>
      </div>
      </Link>
    </div>
    <ThoughtsComp />
    <div>
      <Navbar /> 
  </div>
  
    </>
    );
    }

export default Thoughts;

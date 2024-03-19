  import React, { useState } from "react";
  import Navbar from "../components/Navbar";
  import "../styles/settings.css";

  const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };

    return (
      <div className={darkMode ? "dark-mode" : ""}>
        <Navbar />
        <div>
          <p className="settings_header">Settings</p>
          <div className="settings_theme">
            <p >Theme:</p>
            <button className="settings_theme_btn" onClick={toggleDarkMode}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
          </div>
        </div>
      </div>
    );
  };

  export default Settings;

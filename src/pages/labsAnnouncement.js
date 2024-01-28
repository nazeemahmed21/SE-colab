// LabDetails.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';

const LabAnnouncements= () => {
 
  return (
    <div>
      <Navbar />

      <div className='LabsPageAnnouncement'>
      <Link to="/labs">
          <span className='back-arrow'>← Back</span>
        </Link>
        <h1>Lab A</h1>
        <h1>Announcements</h1>

            {/* Sidebar with lab members */}
            <div className="labSideBar">
              <div className="labSideBarText">
              <ul>
                <p>Lab Files</p>
                <p>Lab Members</p>
                <p>Announcements</p>
                <p>Leave Lab</p>
              </ul>
              </div>
            </div>
      

        <div className='LabsButtons'>
          <button className='LabsButton'>Add a file</button>
          <button className='LabsButton'>Add a folder</button>
        </div>

        <div className='LabsContainer'>
            <Link to="/labDetails">
              <div className="lab" style={{ backgroundImage: 'url("lab_a_bg.jpg")' }}>
                <p>Folder 1</p>
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LabAnnouncements;

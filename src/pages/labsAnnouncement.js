// LabDetails.js

import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';

const LabAnnouncements = () => {
  return (
    <div>
      <Navbar />

      <div className='LabsPageAnnouncement'>
        {/* Sidebar with lab members */}
        <div className="labSideBar">
          <div className="labSideBarText">
            <ul>
            <Link to="/labDetails">
              <p>Lab Files</p>
              </Link>
              <p>Lab Members</p>
              <p>Announcements</p>
              <p>Leave Lab</p>
            </ul>
          </div>
        </div>

        <div className="LabsContent">
          <Link to="/labs">
            <span className='back-arrow'>←</span>
          </Link>
          <h1>Lab A</h1>
       
          <h1>Announcements</h1>

          <div className='LabsAnContainer'>
            <div className="labAnncMessage" style={{ backgroundImage: 'url("lab_a_bg.jpg")' }}>
              <h1>Admin: Hey guys, please get your work done before the deadline.</h1>
              <p>Sent at 6:30 on January 25, 2024</p>
            </div>
            <div className="labAnncMessage" style={{ backgroundImage: 'url("lab_a_bg.jpg")' }}>
              <h1>Admin: Remember to message me if there are any doubts</h1>
              <p>Sent at 6:30 on January 25, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabAnnouncements;

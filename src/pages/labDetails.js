// LabDetails.js

import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';
import folder from "../images/folder.png"
import ppt from "../images/ppt.png"

const LabDetails = () => {
  return (
    <div>
      <Navbar />

      <div className='LabsPageAnnouncement'>
        {/* Sidebar with lab members */}
        <div className="labSideBar">
          <div className="labSideBarText">
            <ul>
              
              <p>Lab Files</p>
              <p>Lab Members</p>
              <Link to="/labAnnouncements">
              <p>Announcements</p>
              </Link>
              <p>Leave Lab</p>
            </ul>
          </div>
        </div>

        <div className="LabsContent">
          <Link to="/labs">
            <span className='back-arrow'>←</span>
          </Link>
          <h1>Lab A</h1>
          <div className='LabsButtons'>
        <button className='LabsButton'>Add a file</button>
        <button className='LabsButton'>Add a folder</button>
        </div>
        <div className='labFolderContainer'>
          <div className="imageContainer">
            <img src={folder} alt="folder" />
            <p>Folder</p>
          </div>
          <div className="imageContainer">
            <img src={ppt} alt="ppt" />
            <p>PPT</p>
          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default LabDetails;

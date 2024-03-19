// LabDetails.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';
import folder from "../images/folder.png"
import ppt from "../images/ppt.png"
import FileSystem from './FileSystem';

const LabDetails = () => {
  const [currentImage, setCurrentImage] = useState(null);

  const handleClick = (image) => {
    setCurrentImage(image);
  };

  return (
    <div>
      <Navbar />
      
      <FileSystem />

      <div className='LabsPageAnnouncement'>
        <div className="labsArrowContainer">
          <Link to="/labs">
            <span className='labsBack-arrow'>←</span>
          </Link>
        </div>

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

        
      </div>
    </div>
  );
};

export default LabDetails;

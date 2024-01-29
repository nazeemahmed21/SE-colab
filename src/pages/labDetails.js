// LabDetails.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';
import folder from "../images/folder.png"
import ppt from "../images/ppt.png"

const LabDetails = () => {
  const [currentImage, setCurrentImage] = useState(null);

  const handleClick = (image) => {
    setCurrentImage(image);
  };

  return (
    <div>
      <Navbar />

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

        <div className="LabsContent">
          <h1>Lab A</h1>
          <div className='LabsButtons'>
            <button className='LabsButton'>Add a file</button>
            <button className='LabsButton'>Add a folder</button>
          </div>
          <div className='labFolderContainer'>
            <div className="labsImageContainer" onClick={() => handleClick(folder)}>
              <img src={folder} alt="folder" />
              <p>Folder</p>
            </div>
            {currentImage && (
              <div className="labsImageContainer slideOutFromFolderAnimation" onClick={() => handleClick(null)}>
                <img src={ppt} alt="ppt" />
                <p>PPT</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDetails;

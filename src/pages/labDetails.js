// // LabDetails.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import '../styles/labs.css';

const LabDetails = () => {

    return (
      <div>
        <Navbar />
  
        <div className='LabsPage'>
        <h1>Lab A</h1>
  
        <div className='LabsButtons'>
          <button className='LabsButton'>Add a file</button>
          <button className='LabsButton'>Add a folder</button>
          </div>
        <div className='LabsContainer'>

          <div className="labBox">

            <div className="labSideBar">

            </div>
            
            <Link to="/labDetails">
            <div className="lab" style={{ backgroundImage: 'url("lab_a_bg.jpg")' }}>
              <p>Folder 1</p>
            </div>
            </Link>


          </div>
  
        </div>
  
        </div>
      </div>
    );
  };

export default LabDetails;

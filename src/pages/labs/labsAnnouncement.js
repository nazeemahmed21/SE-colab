// LabDetails.js

import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import '../../styles/labs.css';

const LabAnnouncements = () => {
  return (
    <div>
        <div className="LabsContent">
          
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
  );
};

export default LabAnnouncements;

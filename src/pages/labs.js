import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/labs.css';
import { Link } from 'react-router-dom';

const Labs = () => {
  return (
    <div>

      <div className='LabsPage'>
 
      <h1>Labs</h1>

      <div className='LabsButtons'>
        <button className='LabsButton'>Join Lab</button>
        <button className='LabsButton'>Create a Lab</button>
        </div>
      <div className='LabsContainer'>
        <Link to="/labDetails">
        <div className="labBox" style={{ backgroundImage: 'url("lab_a_bg.jpg")' }}>
          <p>Lab A</p>
        </div>
        </Link>

        <div className="labBox" style={{ backgroundImage: 'url("lab_b_bg.jpg")' }}>
          <p>Lab B</p>
        </div>

        <div className="labBox" style={{ backgroundImage: 'url("lab_c_bg.jpg")' }}>
          <p>Lab C</p>
        </div>

      </div>

      </div>
    </div>
  );
};

export default Labs;

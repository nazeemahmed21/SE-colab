import React, {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import '../styles/labsnew.css';
import { Link } from 'react-router-dom';
import CreateLab from '../components/labs/createLab';
import MyLabs from '../components/labs/myLabs';
import JoinLab from '../components/labs/joinLab';
import Ad from "./ads.js";
import "../styles/ads.css";

const Labs = () => {
  const [timedPopup, setTimedPopup] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTimedPopup(true);
    }, 5000);
  }, []);
  
  return (
    <div>
      
      <div className="adPop">
         <Ad trigger={timedPopup} setTrigger={setTimedPopup}/>
         </div>

      <Navbar />
      <div className ='labsPageMain'>
      <div className='LabsPage'>
        <h1>Labs</h1>
        <div className='LabsButtons'>
          <JoinLab/>
          <CreateLab/>
        </div>
        <div className = 'MyLabs'>
          <h2>My Labs</h2>
          <MyLabs/>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Labs;

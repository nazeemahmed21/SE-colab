import React from 'react';
import '../styles/interests.css';
import logo from '../images/logo.png';
import {useState} from 'react';
import { db,auth } from '../firebase'; // Import your Firebase configuration
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Interests(){
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState({
    coding: false,
    art: false,
    education: false,
    business: false,
    science: false,
    maths: false,
    gaming: false,
    other: false
  });
  const handleNavigationToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };
  const handleNavigationToSignUp = () => {
    navigate('/profile-setup'); // Navigate to the login page
  };
  const updateDatabase = async (interests) => {
    // Replace 'userId' with the actual user ID
    const user = auth.currentUser;
    const uid = user.uid
    const userDocRef = doc(db, 'Users', uid); 
    try {
      await updateDoc(userDocRef, { interests });
      console.log('Database updated');
    } catch (error) {
      console.error('Error updating database:', error);
    }
  };

  const toggleButton = (button) => {
    setIsActive(prevState => {
      const updatedState = { ...prevState, [button]: !prevState[button] };
      // Prepare the list of selected interests
      const selectedInterests = Object.entries(updatedState)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      // Update database with selected interests
      updateDatabase(selectedInterests);
      return updatedState;
    });
  };

  return (
    <div className='int-interest-container'>
      <div className="int-logo">
        <img src={logo} alt="int-colab-logo"/>
      </div>
      <div className='int-interest-btn'>
        <div className='int-btn-container'>
        <h1>Please choose your interests amongst the following</h1>
          <div className='int-btn-1' >
            <button className={isActive.coding ? 'active' : ''} onClick={()=>
            toggleButton('coding')}>Coding</button>
          </div>
          <div className='int-btn-2'>
            <button className={isActive.art ? 'active' : ''} onClick={()=>
            toggleButton('art')}>Art</button>
          </div>
          <div className='int-btn-3'>
            <button className={isActive.education ? 'active' : ''} onClick={()=>
            toggleButton('education')}>Education</button>
          </div>
          <div className='int-btn-4'>
            <button className={isActive.business ? 'active' : ''} onClick={()=>
            toggleButton('business')}>Business</button>
          </div>
          <div className='int-btn-5'>
            <button className={isActive.science ? 'active' : ''} onClick={()=>
            toggleButton('science')}>Science</button>
          </div>
          <div className='int-btn-6'>
            <button className={isActive.maths ? 'active' : ''} onClick={()=>
            toggleButton('maths')}>Maths</button>
          </div>
          <div className='int-btn-7'>
            <button className={isActive.gaming ? 'active' : ''} onClick={()=>
            toggleButton('gaming')}>Gaming</button>
          </div>
          <div className='int-btn-8'>
            <button className={isActive.other ? 'active' : ''} onClick={()=>
            toggleButton('other')}>Other</button>
          </div>
        </div>
        <div className='int-go-to-login'>
          <button onClick={handleNavigationToLogin}>Next</button>
        </div>
        <div className='int-go-to-signup'>
          <button onClick={handleNavigationToSignUp}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default Interests
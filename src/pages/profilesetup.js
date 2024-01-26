import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import logo from '../images/logo.png'
import { useNavigate } from 'react-router-dom';
// Placeholder image URL
const placeholderImageUrl = 'https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg';

const ProfileSetup = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    secondname: '',
    ProfPic: placeholderImageUrl,
    Role: '',
  });

  // Function to fetch and set user data
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = doc(db, 'Users', userId);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstname: userData.firstName || '',
            secondname: userData.lastName || '',
            ProfPic: userData.pfpURL || placeholderImageUrl,
            Role: userData.role || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  const uploadImage = async () => {
    if (imageUpload == null) return;
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const imageRef = ref(storage, `user-profiles/${userId}/profile-img`);

    try {
      await uploadBytes(imageRef, imageUpload);
      alert("Image Uploaded");

      const url = await getDownloadURL(imageRef);
      const userRef = doc(db, "Users", userId);

      // Use the updateDoc function to update the 'pfpURL' field without affecting other fields
      await updateDoc(userRef, {
        pfpURL: url
      });

      // Update the ProfPic in state with the uploaded image URL
      setUserInfo((prevState) => ({
        ...prevState,
        ProfPic: url,
      }));
    } catch (error) {
      console.error("Error uploading image or updating document:", error);
    }
  };
  const navigateToLogin = () => {
    // Use history.push to navigate to the login page
    navigate('/login');
  };
  return (
    <div style={{
      backgroundColor: '#fbf9ed',
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid #ccc',
        padding: '20px',
        // borderRadius: '5px',
        backgroundColor: '#d1f3ff',
        maxWidth: '1000px',
        height: '96vh',
        justifyContent: 'center'
      }}>
        <div className='user-pfp'>
          <img className='profile-pic' src={userInfo.ProfPic} alt='profile pic' style={{
            width: '200px',
            height: '200px',
            border: '5px solid grey',
            borderRadius: '50%',
          }} />
        </div>
        <h1>Choose a Profile Picture for your Co-lab Account</h1>
        <input type='file' onChange={(event) => setImageUpload(event.target.files[0])} style={{
          width: '50%',
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          fontSize: '20px',
          textAlign: 'center',
          backgroundColor: '#007bff',
          color: 'white'
        }} />
        <button className='pfp-signup_button' onClick={uploadImage} style={{
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
          margin: 0,
          fontSize: '20px',
          width: '52%'
        }}>Upload Image</button>
        <div className='pfp-user-info' style={{
          fontSize: '30px',
          fontWeight: 'bolder'
        }}>
          <p>First Name: {userInfo.firstname}</p>
          <p>Last Name: {userInfo.secondname}</p>
          <p>Role: {userInfo.Role}</p>
        </div>
        <div>
        <button className='pfp-confirm-btn' style={{
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
          margin: 0,
          fontSize: '30px',
            width: '500px',
          height: '50px',
          border: '1px solid #ccc',
        }} onClick={navigateToLogin}>Confirm</button>
        </div>  
        <div className='pfp-image-container' style={{
          marginLeft: '-2200px'
        }}>
        <img className= "pfp-image_container"src={logo} alt='logo' />
        </div>
        <div className='interests'>
          <select
            name="interests-names"
            id="int-names"
            // onChange={} // Use the handleRoleChange function
          >
            <option value="default">Please select your interests</option>
            <option value="Student">Programming</option>
            <option value="Educator">Art</option>
            <option value="Educator">Business</option>
            <option value="Educator">Education</option>
            <option value="Educator">Maths</option>
            <option value="Educator">Science</option>
            <option value="Educator">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;

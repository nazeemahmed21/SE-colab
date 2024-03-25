import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import "../styles/profilesetup.css";
import toast, { Toaster } from "react-hot-toast";

// Placeholder image URL
const placeholderImageUrl =
  "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg";

const ProfileSetup = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const navigate = useNavigate();
  const handleNavigationToInterest = () => {
    navigate("/interest"); // Navigate to the interest page
  };
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    ProfPic: placeholderImageUrl,
    Role: "",
  });

  // Function to fetch and set user data
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = doc(db, "Users", userId);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstname: userData.firstName || "",
            lastname: userData.lastName || "",
            ProfPic: userData.pfpURL || placeholderImageUrl,
            Role: userData.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      // alert("Image Uploaded");
      toast.success("Image Uploaded");

      const url = await getDownloadURL(imageRef);
      const userRef = doc(db, "Users", userId);

      // Use the updateDoc function to update the 'pfpURL' field without affecting other fields
      await updateDoc(userRef, {
        pfpURL: url,
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
  // const navigateToLogin = () => {
  //   // Use history.push to navigate to the login page
  //   navigate('/interest');
  // };
  return (
    <>
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: "1.75rem",
            },
          }}
        />
      </div>
      <div className="profile_setup_container">
        <div className="profile_setup_content">
          <div className="user_pfp">
            <img
              className="profile_pic"
              src={userInfo.ProfPic}
              alt="profile pic"
            />
          </div>
          <h1>Choose a Profile Picture for your Co-lab Account</h1>
          <input
            type="file"
            onChange={(event) => setImageUpload(event.target.files[0])}
            className="upload_input"
          />
          <button className="upload_button" onClick={uploadImage}>
            Upload Image
          </button>
          <div className="user_info">
            <p>First Name: {userInfo.firstname}</p>
            <p>Last Name: {userInfo.lastname}</p>
            <p>Role: {userInfo.Role}</p>
          </div>
          <div className="button_container">
            <button
              className="skip_button"
              onClick={handleNavigationToInterest}
            >
              Skip
            </button>
            <button
              className="next_button"
              onClick={handleNavigationToInterest}
            >
              Next
            </button>
          </div>
          <div className="logo_container">
            <img className="logo_image" src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetup;

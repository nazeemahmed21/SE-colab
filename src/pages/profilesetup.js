import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Sun } from "../images/Sun.svg";
import { ReactComponent as Moon } from "../images/Moon.svg";

// Placeholder image URL
const placeholderImageUrl =
  "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg";

const ProfileSetup = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const navigate = useNavigate();
  const handleNavigationToInterest = () => {
    navigate("/interest"); // Navigate to the login page
  };
  const handleNavigationSignUp = () => {
    navigate("/signup"); // Navigate to the login page
  };
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: placeholderImageUrl,
    Role: "",
  });

  // Function to fetch and set user data
  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    //sdklnverlfvc
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = doc(db, "Users", userId);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstname: userData.firstName || "",
            secondname: userData.lastName || "",
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
      alert("Image Uploaded");

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
        <div
          style={{
            backgroundColor: "#fea059",
            margin: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              flex: "0 0 50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              border: "1px solid #ccc",
              padding: "20px",
              // borderRadius: '5px',
              backgroundColor: "#29ada0",
              maxWidth: "1000px",
              height: "100vh",
              justifyContent: "center",
            }}
          >
            <div className="user-pfp">
              <img
                className="profile-pic"
                src={userInfo.ProfPic}
                alt="profile pic"
                style={{
                  width: "200px",
                  height: "200px",
                  border: "5px solid grey",
                  borderRadius: "50%",
                  position: "absolute",
                  left: "68%",
                  top: "5%",
                }}
              />
            </div>
            <h1
              style={{
                position: "absolute",
                top: "33%",
              }}
            >
              Choose a Profile Picture for your Co-lab Account
            </h1>
            <input
              type="file"
              onChange={(event) => setImageUpload(event.target.files[0])}
              style={{
                width: "15%",
                marginBottom: "20px",
                padding: "10px",
                border: "3px solid black",
                borderRadius: "20px",
                fontSize: "20px",
                textAlign: "center",
                color: "white",
                position: "absolute",
                top: "40%",
                backgroundColor: "#FFA07A",
              }}
            />
            <button
              className="pfp-signup_button"
              onClick={uploadImage}
              style={{
                position: "absolute",
                backgroundColor: "#FFA07A",
                color: "white",
                cursor: "pointer",
                margin: 0,
                fontSize: "20px",
                width: "15%",
                height: "7.6%",
                border: "3px solid black",
                borderRadius: "20px",
                top: "49%",
              }}
            >
              Upload Image
            </button>
            <div
              className="pfp-user-info"
              style={{
                position: "absolute",
                fontSize: "30px",
                fontWeight: "bolder",
                color: "white",
                padding: "20px",
                top: "55%",
              }}
            >
              <p style={{ marginBottom: "20px" }}>
                First Name: {userInfo.firstname}
              </p>
              <p style={{ marginBottom: "20px" }}>
                Last Name: {userInfo.secondname}
              </p>
              <p style={{ marginBottom: "20px" }}>Role: {userInfo.Role}</p>
            </div>
            <div>
              <button
                className="pfp-confirm-btn"
                style={{
                  position: "absolute",
                  backgroundColor: "#FFA07A",
                  color: "white",
                  cursor: "pointer",
                  margin: 0,
                  fontSize: "16px",
                  width: "100px",
                  height: "60px",
                  border: "3px solid black",
                  borderRadius: "100px",
                  bottom: "2%",
                  left: "90%",
                }}
                onClick={handleNavigationToInterest}
              >
                Confirm
              </button>
            </div>
            <button
              style={{
                position: "fixed",
                bottom: "2%",
                left: "54%",
                margin: "0",
                padding: "20px",
                height: "60px" /* Adjusted for better vertical spacing */,
                width: "100px",
                textAlign: "center" /* Centers text horizontally */,
                lineHeight: "20px" /* Centers text vertically */,
                color: "white" /* Optional: Set your text color */,
                fontSize: "16px" /* Optional: Adjust text size */,
                cursor: "pointer",
                borderRadius: "100px",
                border: "3px solid black",
                backgroundColor: "#FFA07A",
              }}
              onClick={handleNavigationSignUp}
            >
              Back
            </button>
            <div
              className="pfp-image-container"
              style={{
                position: "absolute",
                left: "15%",
                top: "30%",
                width: "100px",
                height: "60px",
              }}
            >
              <img className="pfp-image_container" src={logo} alt="logo" />
            </div>
          </div>
        </div>
        {/* WHY THE FUCK IS THIS NOT SHOWING UP */}
        <div style={{ position: "absolute", right: 0 }}>
          <p> wtf</p>
          <input type="checkbox" id="darkmode-toggle" />
          <label for="darkmode-toggle">
            <Sun />
            <Moon />
          </label>
        </div>
        {/* WHY THE FUCK IS THIS NOT SHOWING UP */}
      </div>
    </>
  );
};

export default ProfileSetup;

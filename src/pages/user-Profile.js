import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "../styles/userProfile.css";

const UserProfile = () => {
  const roles = ["Student", "Educator", "Marketer", "Artist"]; // Add roles here
  const [newImage, setNewImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: "",
    Role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedSecondName, setEditedSecondName] = useState("");
  const [editedRole, setEditedRole] = useState("");
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
            secondname: userData.lastName || "",
            ProfPic: userData.pfpURL || "",
            Role: userData.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    setEditedFirstName(userInfo.firstname);
    setEditedSecondName(userInfo.secondname);
    setEditedRole(userInfo.Role);
  }, [userInfo]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (newImage) {
      const imageRef = ref(
        storage,
        `user-profiles/${auth.currentUser.uid}/profile-img`
      );
      try {
        await uploadBytes(imageRef, newImage);
        const url = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "Users", auth.currentUser.uid), {
          pfpURL: url,
        });
        setUserInfo({ ...userInfo, ProfPic: url });
        alert("Profile image updated successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleNameChange = () => {
    setIsEditing(true);
  };

  const handleSaveNameChange = async () => {
    const userRef = doc(db, "Users", auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        firstName: editedFirstName,
        lastName: editedSecondName,
        role: editedRole,
      });
      setUserInfo({
        ...userInfo,
        firstname: editedFirstName,
        secondname: editedSecondName,
      });
      setIsEditing(false);
      alert("Name updated successfully");
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };
  const handleSaveRoleChange = async () => {
    const userRef = doc(db, "Users", auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        role: editedRole,
      });
      setUserInfo({ ...userInfo, Role: editedRole });
      setIsEditing(false);
      alert("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="up-user-profile-container">
        <img
          src={userInfo.ProfPic || "default-profile-pic-url.jpg"}
          alt="Profile"
          className="up-profile-pic"
        />
        <div></div>
        <>
          <div className="up-name">
            <input
              type="text"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
            />
            <br></br>
            <br></br>
            <input
              type="text"
              value={editedSecondName}
              onChange={(e) => setEditedSecondName(e.target.value)}
            />
          </div>
          {/* <div className='up-save'>
            <button onClick={handleSaveNameChange}>Save Changes</button>
          </div> */}
        </>
        <>
          <div className="up-currentname">
            <p>
              Firstname:<span></span>
              {userInfo.firstname}
            </p>
            <p>
              Surname:<span></span>
              {userInfo.secondname}
            </p>
            <p>
              Role:<span></span>
              {userInfo.Role}
            </p>
          </div>

          <div className="up-edit-name">
            <button onClick={handleSaveNameChange}>Edit Name</button>
          </div>
        </>
        <div className="up-file">
          <input type="file" onChange={handleImageChange} />
        </div>
        <div className="up-edit-role">
          <button onClick={handleSaveNameChange}>Edit Role</button>
        </div>
        <div className="up-roles">
          <select
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="up-update-img">
          <button onClick={handleImageUpload}>Update Image</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "../styles/thoughtscomp.css";
//============================================================
//DISCLAIMER, READ THE FOLLOWING LIST OF WORDS AT YOUR OWN RISK, ONLY USED FOR THE PURPOSE OF TESTING AND FILTERING OUT VULGAR WORDS
//============================================================
const vulgarWords = []; // Taken from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt

function containsVulgarWords(text) {
  const lowerCaseText = text.toLowerCase();
  return vulgarWords.some((word) => lowerCaseText.includes(word));
}

function ThoughtsPopup({
    trigger,
    setTrigger,
    setEditThoughtData,
    editThoughtData,
  }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // If editPostData exists, set the state variables with its values
    if (editThoughtData) {
      setTitle(editThoughtData.title || "");
      setPostText(editThoughtData.postText || "");
      setImageUrl(editThoughtData.imageUrl || null);
    }
  }, [editThoughtData]);

  const handleCloseThoughtPop = () => {
    setTrigger(false);
    // Reset the state variables after closing the popup
    setTitle("");
    setPostText("");
    setImageUrl(null);
    setEditThoughtData(null); // Reset editThoughtData
  };

  const uploadImage = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(
      storage,
      `thoughtImages/${imageUpload.name + uuidv4()}`
    );
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(snapshot.ref);

    setImageUrl(imageUrl);
    alert("Uploaded an image!");
  };

  const createThought = async () => {
    if (
      containsVulgarWords(postText) ||
      containsVulgarWords(title) ) {
      alert("Please avoid using vulgar or offensive words.");
      return;
    }

    const timestamp = serverTimestamp();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("User not logged in.");
      return;
    }

    const userId = currentUser.uid;
    const userRef = doc(db, "Users", userId);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const authorName = `${userData.firstName} ${userData.lastName}`;

        await addDoc(collection(db, "thoughts"), {
          title,
          postText,
          imageUrl,
          author: {
            name: authorName,
            id: userId,
          },
          timestamp,
        });

        setTrigger(false);
        alert("Uploaded a thought!");
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Error adding thought:", error);
      alert("An error occurred while adding the thought.");
    }
  };

  const editThought = async () => {
    if (
      containsVulgarWords(postText) ||
      containsVulgarWords(title)  ) {
      alert("Please avoid using vulgar or offensive words.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("User not logged in.");
      return;
    }

    const userId = currentUser.uid;
    const userRef = doc(db, "Users", userId);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const authorName = `${userData.firstName} ${userData.lastName}`;

        const postRef = doc(db, "thoughts", editThoughtData.id);

        await updateDoc(postRef, {
          title,
          postText,
          imageUrl,
        });

        alert("Thought updated successfully!");
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Error updating Thought:", error);
      alert("An error occurred while updating the Thought.");
    }
  };

  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleCloseThoughtPop}>
          Close
        </button>
        <div className="createPostPage">
          <div className="cpContainer">
            <h1>{editThoughtData ? "Edit Event" : "Create Event"}</h1>{" "}
            {/* Display appropriate title based on editPostData */}
            <div className="inputGp">
              <label>Title: </label>
              <input
                placeholder="Title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <label>Post: </label>
              <textarea
                placeholder="Post..."
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <input
                type="file"
                onChange={(event) => setImageUpload(event.target.files[0])}
              />
            </div>
            <div className="inputGp">
              <button onClick={uploadImage}>Upload Image</button>
              {editThoughtData ? ( // Display appropriate button based on editPostData
                <button onClick={editThought}>Edit Post</button>
              ) : (
                <button onClick={createThought}>Create Post</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default ThoughtsPopup;
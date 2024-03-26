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
import "../styles/events.css";
import toast, { Toaster } from "react-hot-toast";
//============================================================
//DISCLAIMER, READ THE FOLLOWING LIST OF WORDS AT YOUR OWN RISK, ONLY USED FOR THE PURPOSE OF TESTING AND FILTERING OUT VULGAR WORDS
//============================================================
const vulgarWords = [
  "vulgar", "offensive", "bad", "harmful", "hate", "controversial"
]; // Taken from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt

function containsVulgarWords(text) {
  const lowerCaseText = text.toLowerCase();
  return vulgarWords.some((word) => lowerCaseText.includes(word));
}

function Popup({
  trigger,
  setTrigger,
  editPostData, // Receive editPostData
  setEditPostData,
}) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [location, setLocation] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [maxAttendees, setMaxAttendees] = useState(0); // New state for maximum attendees
  const navigate = useNavigate();

  useEffect(() => {
    // If editPostData exists, set the state variables with its values
    if (editPostData) {
      setTitle(editPostData.title || "");
      setPostText(editPostData.postText || "");
      setDateFrom(editPostData.dateFrom || "");
      setDateTo(editPostData.dateTo || "");
      setLocation(editPostData.location || "");
      setCategory(editPostData.category || "");
      setImageUrl(editPostData.imageUrl || null);
      setMaxAttendees(editPostData.maxAttendees || 0); // Set max attendees
    }
  }, [editPostData]);

  const handleClosePopup = () => {
    setTrigger(false);
    // Reset the state variables after closing the popup
    setTitle("");
    setPostText("");
    setDateFrom("");
    setDateTo("");
    setLocation("");
    setCategory("");
    setImageUrl(null);
    setMaxAttendees(0); // Reset max attendees
    setEditPostData(null);
  };

  const uploadImage = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name + uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(snapshot.ref);

    setImageUrl(imageUrl);
    // alert("Uploaded an image!");
    toast.success("Uploaded an image!");
  };

  const createPost = async () => {
    if (
      containsVulgarWords(postText) ||
      containsVulgarWords(title) ||
      containsVulgarWords(location)
    ) {
      // alert("Please avoid using vulgar or offensive words.");
      toast.error("Please avoid using vulgar or offensive words.");
      return;
    }

    const timestamp = serverTimestamp();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // alert("User not logged in.");
      toast.error("User not logged in.");
      return;
    }

    const userId = currentUser.uid;
    const userRef = doc(db, "Users", userId);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const authorName = `${userData.firstName} ${userData.lastName}`;

        await addDoc(collection(db, "posts"), {
          title,
          postText,
          dateFrom,
          dateTo,
          location,
          imageUrl,
          category,
          author: {
            name: authorName,
            id: userId,
          },
          timestamp,
          maxAttendees, // Add max attendees to the post
          rsvpCount: 0, // Initialize RSVP count
          rsvps: [], // Initialize RSVP list
        });

        setTrigger(false);
        // alert("Uploaded an event!");
        toast.success("Uploaded an event!");
      } else {
        // alert("User data not found.");
        toast.error("User data not found.");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      //alert("An error occurred while adding the post.");
      toast.error("An error occurred while adding the post.");
    }
  };

  const editPost = async () => {
    if (
      containsVulgarWords(postText) ||
      containsVulgarWords(title) ||
      containsVulgarWords(location)
    ) {
      //alert("Please avoid using vulgar or offensive words.");
      toast.error("Please avoid using vulgar or offensive words.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      //alert("User not logged in.");
      toast.error("User not logged in.");
      return;
    }

    const userId = currentUser.uid;
    const userRef = doc(db, "Users", userId);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const authorName = `${userData.firstName} ${userData.lastName}`;

        const postRef = doc(db, "posts", editPostData.id);

        await updateDoc(postRef, {
          title,
          postText,
          dateFrom,
          dateTo,
          location,
          imageUrl,
          category,
          maxAttendees, // Update max attendees
        });

        //alert("Post updated successfully!");
        toast.success("Post updated successfully!");
      } else {
        //alert("User data not found.");
        toast.error("User data not found.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      //alert("An error occurred while updating the post.");
      toast.error("An error occurred while updating the post.");
    }
  };

  return trigger ? (
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
      <div className="popup">
        <div className="popup-inner">
          <button className="close-btn" onClick={handleClosePopup}>
            Close
          </button>
          <div className="createPostPage">
            <div className="cpContainer">
              <h1>{editPostData ? "Edit Event" : "Create Event"}</h1>{" "}
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
                <label>From: </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </div>
              <div className="inputGp">
                <label>To: </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </div>
              <div className="inputGp">
                <label>Location: </label>
                <textarea
                  placeholder="Location..."
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
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
                <label>Category: </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="fun">Fun</option>
                  <option value="technology">Technology</option>
                  <option value="art">Art</option>
                  <option value="education">Education</option>
                  <option value="gaming">Gaming</option>
                  <option value="business">Business</option>
                  <option value="general science">General Science</option>
                  <option value="maths">Maths</option>
                </select>
              </div>
              <div className="inputGp">
                <label>Maximum Attendees: </label>
                <input
                  type="number"
                  value={maxAttendees}
                  onChange={(event) =>
                    setMaxAttendees(parseInt(event.target.value))
                  }
                />
              </div>
              <div className="inputGp">
                <button onClick={uploadImage}>Upload Image</button>
                {editPostData ? ( // Display appropriate button based on editPostData
                  <button onClick={editPost}>Edit Post</button>
                ) : (
                  <button onClick={createPost}>Create Post</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
}

export default Popup;

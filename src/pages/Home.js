import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import Notification from "./Notification";
import EventAnalytics from "./EventAnalytics";
import "../styles/events.css";
import Searchbar from "./Searchbar";
import toast, { Toaster } from "react-hot-toast";

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editPostData, setEditPostData] = useState(null); // New state to hold data of post being edited

  const [rsvpNotifications, setRsvpNotifications] = useState({});
  const [rsvpStatus, setRsvpStatus] = useState({});

  const postsCollectionRef = collection(db, "posts");
  const notificationsCollectionRef = collection(db, "notifications");
  const navigate = useNavigate();

  const rsvpAlert = (post) => {
    if (post.rsvpCount >= post.maxAttendees) {
      // alert("Sorry, this event is full.");
      toast.error("Sorry, this event is full.");
      return;
    }

    const user = auth.currentUser;
    if (rsvpStatus[post.id]) {
      cancelRSVP(post);
    } else {
      addRSVP(post);
    }
  };

  const addRSVP = async (post) => {
    const user = auth.currentUser;
    const postId = post.id;

    if (post.rsvpCount >= post.maxAttendees) {
      // alert("Sorry, this event is full.");
      toast.error("Sorry, this event is full.");
      return;
    }

    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, {
      rsvpCount: post.rsvpCount ? post.rsvpCount + 1 : 1,
      rsvps: arrayUnion(user.uid), // Add user ID to the rsvps array
    });

    const userRef = doc(db, "Users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    const notificationMessage = `${userData.firstName} ${userData.lastName} RSVPed to your event: ${post.title}`;
    await addDoc(notificationsCollectionRef, {
      userId: post.author.id,
      postId: postId,
      message: notificationMessage,
    });

    const eventData = {
      Title: post.title,
      "Start Date": new Date(post.dateFrom), // Convert to Date object
      "End Date": new Date(post.dateTo), // Convert to Date object
      uid: user.uid, // Include user ID
    };

    // Trigger the function to add the RSVP and create an event on the calendar
    handleAddRSVPAndEvent(eventData);

    const updatedRsvpStatus = { ...rsvpStatus, [postId]: true };
    setRsvpStatus(updatedRsvpStatus);
    localStorage.setItem("rsvpStatus", JSON.stringify(updatedRsvpStatus));

    if (post.rsvpCount + 1 === post.maxAttendees) {
      const postDoc = doc(db, "posts", postId);
      await updateDoc(postDoc, {
        maxAttendeesReached: true,
      });
    }

    // alert("RSVPed!");
    toast.success("RSVPed!");
    getFilteredPosts();
  };

  const handleAddRSVPAndEvent = async (eventData) => {
    // Add the event data to the Firestore collection
    try {
      const docRef = await addDoc(collection(db, "CalendarEvents"), eventData);
      console.log("Event added to Firestore with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding event to Firestore: ", error);
    }
  };

  const cancelRSVP = async (post) => {
    const user = auth.currentUser;
    const postId = post.id;

    const postDoc = doc(db, "posts", postId);
    await updateDoc(postDoc, {
      rsvpCount: post.rsvpCount ? post.rsvpCount - 1 : 0,
      rsvps: arrayRemove(user.uid),
    });

    const notificationQuery = query(
      notificationsCollectionRef,
      where("userId", "==", post.author.id),
      where("postId", "==", postId)
    );
    const notificationSnapshot = await getDocs(notificationQuery);
    notificationSnapshot.forEach(async (notification) => {
      await deleteDoc(doc(db, "notifications", notification.id));
    });

    // Update RSVP status and notifications in local storage
    const updatedRsvpStatus = { ...rsvpStatus, [postId]: false };
    setRsvpStatus(updatedRsvpStatus);
    localStorage.setItem("rsvpStatus", JSON.stringify(updatedRsvpStatus));

    // alert("RSVP Cancelled!");
    toast.success("RSVP Cancelled!");
    getFilteredPosts();
  };

  const getFilteredPosts = async () => {
    let filteredPosts = [];

    if (selectedCategory) {
      const categoryQuery = query(
        postsCollectionRef,
        where("category", "==", selectedCategory)
      );
      const categoryQuerySnapshot = await getDocs(categoryQuery);
      filteredPosts = categoryQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      const allPostsQuerySnapshot = await getDocs(postsCollectionRef);
      filteredPosts = allPostsQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }

    if (searchQuery) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setPostList(filteredPosts);
  };

  useEffect(() => {
    getFilteredPosts();
    const unsubscribe = onSnapshot(postsCollectionRef, () => {
      getFilteredPosts();
    });

    return () => unsubscribe();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const unsubscribeRsvps = onSnapshot(postsCollectionRef, (snapshot) => {
      const newRsvpNotifications = {};
      snapshot.docs.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;
        const postRsvps = post.rsvps || [];
        newRsvpNotifications[postId] = postRsvps.map(
          (userId) => `${userId} RSVPed to your event: ${post.title}`
        );
      });
      setRsvpNotifications(newRsvpNotifications);
    });

    // Retrieve RSVP status from local storage
    const localStorageRsvpStatus =
      JSON.parse(localStorage.getItem("rsvpStatus")) || {};
    setRsvpStatus(localStorageRsvpStatus);

    return () => unsubscribeRsvps();
  }, []);

  const editPost = async (postId) => {
    const post = postLists.find((post) => post.id === postId);
    setEditPostData(post);
    setButtonPopup(true);
  };

  const deletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        // alert("Post deleted successfully!");
        toast.success("Post deleted successfully!");
        getFilteredPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        // alert("An error occurred while deleting the post.");
        toast.error("An error occurred while deleting the post.");
      }
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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
      <div className="homePage">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button className="CreateEvent" onClick={() => setButtonPopup(true)}>
          Create Event
        </button>

        <button className="notif" onClick={handleToggleNotifications}>
          Show Notifications
        </button>
        <Popup
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
          editPostData={editPostData} // Pass editPostData to Popup
          setEditPostData={setEditPostData}
        />

        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All</option>
          <option value="fun">Fun</option>
          <option value="technology">Technology</option>
          <option value="art">Art</option>
          <option value="education">Education</option>
          <option value="gaming">Gaming</option>
          <option value="business">Business</option>
          <option value="general science">General Science</option>
          <option value="maths">Maths</option>
        </select>

        {showNotifications && <Notification userId={auth.currentUser.uid} />}

        {postLists.map((post) => (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                <h1>{post.title}</h1>
              </div>
            </div>
            <div className="dateFrom">
              <h3>From {post.dateFrom}</h3>
            </div>
            <div className="dateTo">
              <h3> To {post.dateTo}</h3>
            </div>
            <div className="location">
              <h3>At {post.location}</h3>
            </div>
            <div className="postTextContainer">
              <br />
              {post.postText}
            </div>
            <br />
            {post.imageUrl && <img src={post.imageUrl} alt="Post Image" />}
            <div className="postCategory">
              <h2>{post.category}</h2>
            </div>
            <h3>{post.author.name}</h3>
            <button onClick={() => rsvpAlert(post)}>
              {rsvpStatus[post.id] ? "Cancel RSVP" : "RSVP"}
            </button>
            <span>{post.rsvpCount || 0} RSVPs</span>
            <br />
            <p>Limit of Attendees:</p>
            <span>{post.maxAttendees ? post.maxAttendees : ""}</span>{" "}
            {/* Display max attendees */}
            <div className="postInfo">
              <p>
                Posted on:{" "}
                {post.timestamp
                  ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            {post.author.id === auth.currentUser.uid && (
              <div>
                <button className="EditBtn" onClick={() => editPost(post.id)}>
                  Edit
                </button>
                <button
                  className="DeleteBtn"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export default Home;

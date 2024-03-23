import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Notification({ userId, rsvpNotifications }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userNotifications = [];
      for (const postId in rsvpNotifications) {
        for (const notification of rsvpNotifications[postId]) {
          const userIdIndex = notification.indexOf(" "); // Find the index of the first space
          const userId = notification.substring(0, userIdIndex); // Extract the user ID
          const userData = await getUserData(userId);
          userNotifications.push({
            message: notification.substring(userIdIndex + 1), // Extract the message after the user ID
            user: userData,
          });
        }
      }
      setNotifications(userNotifications);
    };

    fetchNotifications();
  }, [userId, rsvpNotifications]);

  const getUserData = async (userId) => {
    try {
      const userRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return `${userData.firstName} ${userData.lastName}`;
      } else {
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return "Unknown User";
    }
  };

  const handleClearNotifications = async () => {
    // Clear notifications in the component state
    setNotifications([]);
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <br></br>
      <div className="notifButton"><button onClick={handleClearNotifications}>Clear Notifications</button></div>
      
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            {notification.user}: {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;

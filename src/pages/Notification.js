import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  const notificationsCollectionRef = collection(db, "notifications");

  useEffect(() => {
    const fetchNotifications = async () => {
      const querySnapshot = await getDocs(notificationsCollectionRef);
      const userNotifications = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          userNotifications.push({ id: doc.id, message: data.message });
        }
      });
      setNotifications(userNotifications);
    };
  
    fetchNotifications();
  }, [userId, notificationsCollectionRef]);
  

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
    // Clear notifications for the user in the database
    const userNotifications = notifications.map((notification) =>
      doc(db, "notifications", notification.id)
    );
    await Promise.all(
      userNotifications.map((notification) => deleteDoc(notification))
    );

    // Clear notifications in the component state
    setNotifications([]);
  };


  return (
    <div className="events_notification-container">
      <h2>Notifications</h2>
      <br></br>
      <div className="events_notifButton"><button onClick={handleClearNotifications}>Clear Notifications</button></div>
      
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

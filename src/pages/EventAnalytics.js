import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/events.css";
import { TbReportAnalytics } from "react-icons/tb";

function EventAnalytics() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRsvpBox, setShowRsvpBox] = useState(false);
  const [rsvpUsers, setRsvpUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "posts"),
        where("author.id", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const eventList = [];

      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const postId = doc.id;
        if (postId && data.title) {
          const rsvps = data.rsvps || [];
          const rsvpNames = await getRsvpNames(postId, rsvps);

          eventList.push({
            id: postId,
            title: data.title,
            rsvpCount: data.rsvpCount || 0,
            rsvpNames: rsvpNames,
          });
        }
      });

      setEvents(eventList);
      setFilteredEvents(eventList);
    };

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      fetchEvents();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filteredEvents = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filteredEvents);
  }, [searchQuery, events]);

  const getRsvpNames = async (postId, rsvps) => {
    const rsvpNames = [];
    for (const userId of rsvps) {
      const userDoc = await getDoc(doc(db, "Users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userName = `${userData.firstName} ${userData.lastName}`;
        rsvpNames.push(userName);
      }
    }
    return rsvpNames;
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleShowRSVPs = (rsvpNames) => {
    setRsvpUsers(rsvpNames);
    setShowRsvpBox(true);
  };

  const handleCloseRsvpBox = () => {
    setShowRsvpBox(false);
  };

  return (
    <div className="event-analytics-container">
      <div className="ta-btn-container">
        <button className="toggle-analytics-button" onClick={handleShowAnalytics}>
          {showAnalytics ? <TbReportAnalytics size={30}/>: <TbReportAnalytics size={30}/> }
        </button>
      </div>
      {showAnalytics && (
        <div className="event-analytics">
          <h2>Your Event Analytics</h2>
          <div className="AnalyticsSearchBar">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-analytics-item">
              <h3>{event.title}</h3>
              <p>Attendees: {event.rsvpCount}</p>
              <button onClick={() => handleShowRSVPs(event.rsvpNames)}>
                Show RSVPs
              </button>
            </div>
          ))}
        </div>
      )}
      {showRsvpBox && (
        <div className="rsvp-users-container">
          <h2>RSVPed Users:</h2>
          <ul>
            {rsvpUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
          <button onClick={handleCloseRsvpBox}>Close</button>
        </div>
      )}
    </div>
  );
}

export default EventAnalytics;

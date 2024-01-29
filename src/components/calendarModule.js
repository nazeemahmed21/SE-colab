import React, { useState, useEffect, useContext } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, onSnapshot, getFirestore, addDoc, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import styles from "../styles/todo.module.css";
import Navbar from "./Navbar";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarApp() {
  const { currentUser } = useContext(AuthContext);

  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(getFirestore(), "CalendarEvents"), (snapshot) => {
      const eventsFromFirestore = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data && data["Start Date"] && data["End Date"] && data.uid === currentUser.uid) {
          const { Title, "Start Date": startDate, "End Date": endDate } = data;
          return {
            title: Title,
            start: new Date(startDate.toDate()), // Convert Firestore timestamp to JavaScript Date
            end: new Date(endDate.toDate()),     // Convert Firestore timestamp to JavaScript Date
            id: doc.id,                           // Include document ID for identification or deletion
          };
        } else {
          // Handle the case where the document doesn't have the expected fields or uid doesn't match
          return null; // Skip this document
        }
      });

      // Filter out null values before updating the state
      setAllEvents(eventsFromFirestore.filter((event) => event !== null));
    });

    return () => {
      // Cleanup subscription when component unmounts
      unsubscribe();
    };
  }, [currentUser]); // Include currentUser as a dependency to re-run the effect when it changes

  const handleAddEvent = async () => {
    // Ensure that newEvent.start and newEvent.end are valid Date objects
    if (newEvent.start instanceof Date && newEvent.end instanceof Date) {
      // Add the new event to Firestore
      const docRef = await addDoc(collection(getFirestore(), "CalendarEvents"), {
        Title: newEvent.title,
        "Start Date": newEvent.start, // Use the user-entered start date
        "End Date": newEvent.end,     // Use the user-entered end date
        "uid": currentUser.uid,
      });

      // Update the local state with the new event including the document ID
      setAllEvents([...allEvents, {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        id: docRef.id,
      }]);

      // Clear the input fields after adding an event
      setNewEvent({ title: "", start: "", end: "" });
    } else {
      // Handle invalid date format (optional)
      console.error("Invalid date format");
    }
  };

  const handleDeleteSelectedEvent = async () => {
    if (selectedEvent) {
      // Delete the event from Firestore
      // Use the document ID to identify the event in the Firestore collection
      await deleteDoc(doc(getFirestore(), "CalendarEvents", selectedEvent.id));

      // Update the local state by filtering out the selected event
      const updatedEvents = allEvents.filter((event) => event !== selectedEvent);
      setAllEvents(updatedEvents);
      setSelectedEvent(null);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="App" style={{ color: "#181D27", width: '1450px', padding: '0px', margin: '0px' }}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Add Title"
            style={{
              width: "20%",
              marginLeft: "400px",
              marginTop: "100px",
              marginRight: "5px",
            }}
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <DatePicker
            placeholderText="Start Date"
            style={{ marginLeft: "10px" }}
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            showTimeSelect
            dateFormat="Pp"
          />
          <DatePicker
            placeholderText="End Date"
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            showTimeSelect
            dateFormat="Pp"
            style={{ position: "absolute", left: "1000px", margin: "30px" }}
          />
          <button
            className={`${styles.button} ${styles.button__primary}`}
            onClick={handleAddEvent}
            style={{ position: "absolute", left: "730px", marginTop: "130px" }}
          >
            Add Event
          </button>
          {selectedEvent && (
            <button
              className={`${styles.button} ${styles.button__secondary}`}
              onClick={handleDeleteSelectedEvent}
              style={{ position: "absolute", left: "695px", marginTop: "170px" }}
            >
              Delete Selected Event
            </button>
          )}
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400, width: 1000, margin: "100px", position: "absolute", marginLeft: "35px", left: "360px", bottom: "50 px", marginTop: "150px" }}
        onSelectEvent={handleSelectEvent}
      />
    </div> 
  );
}

export default CalendarApp;


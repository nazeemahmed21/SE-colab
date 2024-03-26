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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [showNavbar, setShowNavbar] = useState(true);

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
    if (!(newEvent.start instanceof Date) || !(newEvent.end instanceof Date)) {
      // Handle invalid date format (optional)
      console.error("Invalid date format");
      return;
    }
  
    // Check if start date is before the current date
    if (newEvent.start < new Date()) {
      console.error("Start date must be equal to or after the current date");
      // Display an error message (you can use a toast library or other UI notification)
      return;
    }
  
    // Check if end date is before the start date
    if (newEvent.end < newEvent.start) {
      console.error("End date must be equal to or after the start date");
      // Display an error message (you can use a toast library or other UI notification)
      return;
    }
  
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
    toast.info(
      <div>
        <h3>{event.title}</h3>
        <p>Start Date: {event.start.toString()}</p>
        <p>End Date: {event.end.toString()}</p>
      </div>,
      {
        closeButton: true,
      }
    );
  };

  return (
    <div className="App" style={{ color: "#181D27", width: '100%', padding: '0px', margin: '0px', position: 'relative', minHeight: '100vh' }}>
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0rem' }}>
        <div className={styles.form} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Add Title"
            style={{
              width: "80%",
              marginBottom: "0rem",
              maxWidth: "300px",
              marginTop: "85px"
            }}
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <DatePicker
            placeholderText="Start Date"
            className={`${styles.datePicker} ${styles.large}`} // Apply custom styles
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            showTimeSelect
            dateFormat="Pp"
          />
          <DatePicker
            placeholderText="End Date"
            className={`${styles.datePicker} ${styles.large}`} // Apply custom styles
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })} 
            showTimeSelect
            dateFormat="Pp"
          />
          
          <button
            className={`${styles.button} ${styles.button__primary}`}
            onClick={handleAddEvent}
            style={{ width: "70%", marginBottom: "1rem", maxWidth: "300px", alignSelf: 'flex-end', height: "20px", fontSize: "12px", marginTop: "0rem"}}
          >
            Add Event
          </button>
          {selectedEvent && (
            <button
              className={`${styles.button} ${styles.button__secondary}`}
              onClick={handleDeleteSelectedEvent}
              style={{ width: "70%", marginBottom: "1rem", maxWidth: "300px", alignSelf: 'flex-end', height: "40px", fontSize: "12px", marginTop:'-0.7rem'}}
            >
              Delete Selected Event
            </button>
          )}
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', position: 'relative', left: "0px"}}>
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '55vh', width: '100%' }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      {showNavbar && <Navbar style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} />}
      <ToastContainer />
    </div> 
  );
}

export default CalendarApp;


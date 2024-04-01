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
import styles from "../styles/calendar.css";
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
  const [showAddEventPopup, setShowAddEventPopup] = useState(false); // State to control the visibility of the add event popup


  useEffect(() => {
    // Listen for the custom event triggered from Home.js to add RSVP and create event
    const handleAddRSVPAndEvent = (event) => {
      // Add RSVP logic here if needed

      // Create event on the calendar
      setNewEvent({
        title: event.detail.title,
        start: event.detail.start,
        end: event.detail.end,
      });
    };

    window.addEventListener('addRSVPAndEvent', handleAddRSVPAndEvent);

    return () => {
      window.removeEventListener('addRSVPAndEvent', handleAddRSVPAndEvent);
    };
  }, [allEvents]); // Include allEvents as dependency to re-run the effect when it changes

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
      // Display toast message for invalid date format
      toast.error("Invalid date format");
      return;
    }

    // Check if start date is before the current date
    if (newEvent.start < new Date()) {
      // Display toast message for start date before the current date
      toast.error("Start date must be equal to or after the current date");
      return;
    }

    // Check if end date is before the start date
    if (newEvent.end < newEvent.start) {
      // Display toast message for end date before start date
      toast.error("End date must be equal to or after the start date");
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

    // Display toast message for successful event addition
    toast.success("Event added successfully");
    setShowAddEventPopup(false); // Hide the add event popup after successful addition
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
    <div className="CalendarApp" style={{backgroundColor: '#ffffff', color: "#181D27", width: '100%', padding: '0px', margin: '0px', position: 'relative', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />

      {/* Calendar */}
      <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', position: 'relative', left: "0px", top: "100px"}}>
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh', width: '100%' }}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {/* Add Event Button */}
      <button
        style={{ position: 'absolute', zIndex: '999', top: '40px', left: '50%',borderRadius: '10px', transform: 'translate(-50%, -50%)', width:"150px", height: "50px", fontSize: "20px", backgroundColor: "#29ada0", color:"#fff"}}
        onClick={() => setShowAddEventPopup(true)}
      >
        Add Event
      </button>

      {/* Blur background for popups */}
      {(showAddEventPopup || selectedEvent) && (
        <div className="blur-background" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}></div>
      )}

      {/* Add Event Popup */}
      {showAddEventPopup && (
        <div className="add-event-popup" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  fontSize: "20px", backgroundColor: "#29ada0", color:"#fff", padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: '1000' }}>
          <h3>Enter the following:</h3>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            style={{marginLeft: "200px"}}
          />
          <DatePicker
            selected={newEvent.start}
            placeholderText="Start Date"
            onChange={(date) => setNewEvent({ ...newEvent, start: date })}
            showTimeSelect
            dateFormat="Pp"
          />
          <DatePicker
            selected={newEvent.end}
            placeholderText="End Date"
            onChange={(date) => setNewEvent({ ...newEvent, end: date })}
            showTimeSelect
            dateFormat="Pp"
          />
          <button onClick={handleAddEvent}>Add</button>
          <button onClick={() => setShowAddEventPopup(false)}>Cancel</button>
        </div>
      )}
      
      {/* Selected Event Popup */}
      {selectedEvent && (
        <div className="selected-event-popup" style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  fontSize: "20px", backgroundColor: "#29ada0", color:"#fff", padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: '1000' }}>
          <h3>{selectedEvent.title}</h3>
          <p>Start Date: {selectedEvent.start.toString()}</p>
          <p>End Date: {selectedEvent.end.toString()}</p>
          <button onClick={handleDeleteSelectedEvent}>Delete Event</button>
          <button onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default CalendarApp;

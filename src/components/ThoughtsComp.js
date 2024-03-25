import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import ThoughtsPopup from "./ThoughtsPop";
import "../styles/thoughtscomp.css";

function ThoughtsComp() {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editThoughtData, setEditThoughtData] = useState(null);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const q = query(
          collection(db, "thoughts"),
          orderBy("timestamp", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedThoughts = [];
          querySnapshot.forEach((doc) => {
            fetchedThoughts.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setThoughts(fetchedThoughts);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching thoughts:", error);
      }
    };

    fetchThoughts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    try {
      await addDoc(collection(db, "thoughts"), {
        text: newThought,
        timestamp: new Date(),
      });
      setNewThought("");
    } catch (error) {
      console.error("Error adding thought:", error);
    }
  };

  return (
    <>
      <div className="thoughts-container">
        <button onClick={() => setShowPopup(true)}>Create Thought</button>
        {thoughts.map((thought) => (
          <div key={thought.id} className="thought-item">
            <h3>Title: {thought.title}</h3>
            <p>Text: {thought.postText}</p>
            {thought.author ? (
              <p>Author: {thought.author.name}</p>
            ) : (
              <p>Author: Unknown</p>
            )}
            <p>Posted on: {thought.timestamp ? thought.timestamp.toDate().toLocaleString() : "N/A"}</p>
            {/* Add additional fields here if necessary */}
          </div>
        ))}
      </div>
      <ThoughtsPopup
        trigger={showPopup}
        setTrigger={setShowPopup}
        setEditThoughtData={setEditThoughtData}
      />
    </>
  );  
  
}

export default ThoughtsComp;

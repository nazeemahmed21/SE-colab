// ThoughtsComp.js
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  addDoc,
  onSnapshot,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import ThoughtsPopup from "./ThoughtsPop";
import "../styles/thoughtscomp.css";
import { auth } from "../firebase";
import ThoughtsSearchbar from "./ThoughtsSearchbar";

function ThoughtsComp() {
  const [thoughts, setThoughts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editThoughtData, setEditThoughtData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        let q = collection(db, "thoughts");
        if (selectedCategory) {
          q = query(
            q,
            where("category", "==", selectedCategory),
            orderBy("timestamp", "desc")
          );
        } else {
          q = query(q, orderBy("timestamp", "desc"));
        }
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
  }, [selectedCategory]);

  const deleteThought = async (thoughtId) => {
    try {
      await deleteDoc(doc(db, "thoughts", thoughtId));
      setThoughts(thoughts.filter((thought) => thought.id !== thoughtId));
    } catch (error) {
      console.error("Error deleting thought:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "thoughts"),
        where("category", "==", selectedCategory),
        orderBy("timestamp", "desc")
      ),
      (querySnapshot) => {
        const filteredThoughts = [];
        querySnapshot.forEach((doc) => {
          filteredThoughts.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setThoughts(filteredThoughts);
      }
    );

    return unsubscribe;
  }, [selectedCategory]);

  const filteredThoughts = thoughts.filter((thought) => {
    const titleMatch = thought.title.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = thought.author && thought.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || authorMatch;
  });

  return (
    <>
      <div className="thoughts-container">
        <ThoughtsSearchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          className="createThoughtBtn"
          onClick={() => setShowPopup(true)}
        >
          Create Thought
        </button>

        <div className="filter-wrapper">
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
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
        </div>

        {filteredThoughts.length === 0 ? (
          <p>No thoughts found in this category.</p>
        ) : (
          filteredThoughts.map((thought) => (
            <div key={thought.id} className="thought-item">
              <h1>{thought.title}</h1>
              <h2>{thought.postText}</h2>
              {thought.author ? (
                <h3>Posted by: {thought.author.name}</h3>
              ) : (
                <h3>Posted by: Unknown</h3>
              )}
              <p>
                Posted on:{" "}
                {thought.timestamp
                  ? thought.timestamp.toDate().toLocaleString()
                  : "N/A"}
              </p>
              {thought.imageUrl && (
                <img src={thought.imageUrl} alt="Thought Image" />
              )}
              {currentUser && thought.author.id === currentUser.uid && (
                <button className="thoughtDelete" onClick={() => deleteThought(thought.id)}>Delete</button>
              )}
            </div>
          ))
        )}
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

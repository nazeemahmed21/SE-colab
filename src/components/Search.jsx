import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "Users"),
      where("firstName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    setIsLoading(true)
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

        console.log(user.uid);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log(currentUser.uid);
        console.log(combinedId);
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.firstName
            
            // photoURL: user.photoURL
          }

        });
        console.log("gyat1")
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName
            // photoURL: currentUser.photoURL
          }
          
        });
        console.log("gyat2")
        setIsLoading(false);


      }
    } catch (err) { }

    setUser(null);
    setUsername("")
  };
  return (
    <div className="search">
      {isLoading ? (
        // Render a loading indicator, e.g., a spinner
        <div>Loading...</div>
      ) : (
        <div className="searchForm">
          <input
            type="text"
            placeholder="Find a user"
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
      )}

      {err && <span>User not found!</span>}

      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>

  );
};

export default Search;

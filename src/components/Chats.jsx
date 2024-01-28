import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db } from '../firebase';
import "../Style.css";

//new_user@gmail.com , new_user 
const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        setLoading(false);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  // console.log(chats)
  // console.log(Object.entries(chats))
  return (
    <div className="chats">
      {loading ? (
        // Render a loading indicator, e.g., a spinner
        <div>Loading...</div>
      ) : (
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1])}
          >
            {chat[1]?.userInfo && (
              <>
                <img src={chat[1].userInfo.photoURL} alt="" />
                <div className="userChatInfo">
                  <span>{chat[1].userInfo.displayName}</span>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Chats;



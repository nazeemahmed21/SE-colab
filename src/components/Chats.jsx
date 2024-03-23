import { doc, onSnapshot, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db , auth} from "../firebase";

//new_user@gmail.com , new_user 

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: "", // Corrected to match the fetched user data
    Role: "",
  });
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = doc(db, "Users", userId);

        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserInfo({
              firstname: userData.firstName || "",
              secondname: userData.lastName || "",
              ProfPic: userData.pfpURL || "",
              Role: userData.role || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <div className="chats">
      {loading ? (
        <div>Loading...</div>
      ) : (
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            {chat[1]?.userInfo && (
              <>
                <img src={userInfo.ProfPic} alt="" /> {/* Use userInfo.ProfPic for profile picture */}
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
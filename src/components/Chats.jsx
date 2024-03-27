import { collection, documentId, doc, getDoc, onSnapshot, where, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { db, auth } from "../firebase";

//new_user@gmail.com , new_user 
const Chats = () => {
  const [chats, setChats] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    secondname: "",
    ProfPic: "", // Corrected to match the fetched user data
    Role: "",
  });
  const [loading, setLoading] = useState(true);

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
    const getChats = async () => {
      const userChats = await getDoc(doc(db, "userChatMapping", currentUser.uid)).then(doc => doc.data()?.chats);

      const q = query(collection(db, "chatMetadata"), where(documentId(), 'in', userChats==undefined ? ["test"] : userChats));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const chatsArray = [];
        
        querySnapshot.forEach((doc) => {
          chatsArray.push([doc.id, doc.data()]);
        })
        setChats(chatsArray);
        setLoading(false);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  console.log("at",chats);
  const handleSelect = (user, chatId) => {
    dispatch({ type: "CHANGE_USER", payload: { user, chatId } });
  };

  // console.log(chats)
  // console.log(Object.entries(Users))
  return (
    <div className="chats">
       {loading ? (
        // Render a loading indicator, e.g., a spinner
        <div>Loading...</div>
      ) : (
      chats?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo, chat[0])}
        >
         
          {chat[1]?.userInfo && (
            <>
         {/* { chat[1].userInfo.pfpURL && ( */}
          <img src={userInfo.ProfPic} alt="" />
{/* )}  */}
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



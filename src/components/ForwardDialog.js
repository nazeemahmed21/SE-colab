import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { storage } from '../firebase';
import { updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
const ForwardDialog = ({ messageId, messageText, onClose, onForward }) => {
  const [recipientId, setRecipientId] = useState('');
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedMessageText, setSelectedMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [gif, setGif] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to manage emoji picker visibility
  const { data } = useContext(ChatContext);

  useEffect(() => {
    // Fetch users from Firebase
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await db.collection('users').get();
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name, // Assuming 'name' is a field in your user documents
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
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

  const handleSelect = (userName, messageText) => {
    console.log("Selected user:", userName);
    console.log("Selected mssg:", messageText); // Log the selected user's name
    setSelectedMessageText(messageText); // Set the selected message text
    const selectedUser = users.find(user => user.name === userName);
    if (selectedUser) {
      setRecipientId(selectedUser.id);
      handleForwardMessage(selectedUser.id);
    }
  };

  const handleForwardMessage = async () => {
    try{

      let messagePayload = {
        id: uuid(),
        text:messageText,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        owner: true, // Set the owner flag to true for the messages you send
      };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.error("Error uploading image:", error); 
        },
        async () => {
          try {
            // Wait for a short duration to ensure that the download URL is available
            await new Promise(resolve => setTimeout(resolve, 1000));
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

console.log("downloadURL", recipientId);
            await updateDoc(doc(db, "chats", recipientId), {
              messages: arrayUnion({
                id: uuid(),
                text: messageText,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            
          }
        }
      );
    } else if (gif) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          gif: gif.url, // Include the GIF URL in the message payload
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: messageText,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          owner: true,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text:messageText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text:messageText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setGif(null);
   }catch (error) {
    console.error("Error sending message:", error);
    // TODO: Handle error, show error message to the user
  } 
  };

  return (
    <div className="forward-dialog">
            <p>Forward " {messageText} "</p>
      <h3>Select Recipient</h3>
      {users.length > 0 && (
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        >
          <option value="">Select a recipient</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      )}
  
      <div className="selected-message">
  
      </div>
      <div className="chats">
        {loading ? (
          // Render a loading indicator, e.g., a spinner
          <div>Loading...</div>
        ) : (
          Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo.displayName, messageText)}
            >
              {chat[1]?.userInfo && (
                <div className="userChatInfo">
                  <span>{chat[1].userInfo.displayName}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="buttons">
      <button onClick={handleForwardMessage}>Forward</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ForwardDialog;
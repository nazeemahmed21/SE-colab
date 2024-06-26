import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { storage } from '../firebase';
import { getDoc, query, collection, where, documentId, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
const ForwardDialog = ({ messageId, messageText, onClose, onForward }) => {
  const [recipientId, setRecipientId] = useState('');
  const [users, setUsers, Users] = useState([]);
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

//   const handleSelect = (userName, messageText) => {
//     console.log("Selected user:", userName);
//     console.log("Selected mssg:", messageText); // Log the selected user's name
//     setSelectedMessageText(messageText); // Set the selected message text
//     const selectedUser = users.find(user => user.name === userName);
// Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
//   console.log("Selected user 2:", chat[1].userInfo.uid);
//   if (selectedUser) {
//     setRecipientId(selectedUser.id);
//     handleForwardMessage(userName.id);
//   }
// })
//   }

const handleSelect = (userName, messageText) => {
  console.log("Selected user:", userName);
  console.log("Selected message:", messageText); // Log the selected user's name
  setSelectedMessageText(messageText);

  // Search for the user by display name
  const selectedUser = chats.find((chat) => chat[1]?.userInfo?.displayName === userName);
  // Extract the uid if the user is found
  if (selectedUser) {
    console.log("Selected user UID:", selectedUser[1].userInfo.uid);
   handleForwardMessage(selectedUser[1].userInfo.uid);
    // Add your logic here to handle the selected user's UID
  } else {
    console.log("User not found");
  }
};

  const handleForwardMessage = async (recipientId) => {
    try{

      let messagePayload = {
        id: uuid(),
        text:messageText,
        senderId: recipientId.uid,
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
            await updateDoc(doc(db, "chatMessages", recipientId.uid), {
              messages: arrayUnion({
                id: uuid(),
                text: messageText,
                senderId: recipientId.uid,
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
      await updateDoc(doc(db, "chatMessages", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          gif: gif.url, // Include the GIF URL in the message payload
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }else {
      await updateDoc(doc(db, "chatMessages", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: messageText,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          owner: true,
        }),
      });
    }

    await updateDoc(doc(db, "chatMetadata", data.chatId), {
      lastMessage: {
        text:messageText,
      },
      date: serverTimestamp(),
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
           console.log("chat", chat[1].userInfo.pfpURL),
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo.displayName, messageText)}
            >
              {chat[1]?.userInfo && (
                <div className="userChatInfo">
                    {/* <img src={chat[1].userInfo.pfpURL} alt="" /> */}
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
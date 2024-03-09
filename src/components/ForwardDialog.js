import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

const ForwardDialog = ({ messageId, messageText, onClose, onForward }) => {
  const [recipientId, setRecipientId] = useState('');
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedMessageText, setSelectedMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

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
    console.log("Selected user:", userName); // Log the selected user's name
    setSelectedMessageText(messageText); // Set the selected message text
    const selectedUser = users.find(user => user.name === userName);
    if (selectedUser) {
      setRecipientId(selectedUser.id);
      handleForwardMessage(selectedUser.id);
    }
  };

  const handleForwardMessage = async (recipientId) => {
    try {
      // Check if recipient ID is provided
      if (!recipientId) {
        console.error('Recipient ID is required');
        return;
      }

      // Update recipient's chat with forwarded message
      await db.collection('chats').doc(recipientId).collection('messages').add({
        text: messageText,
        senderId: messageId, // Include the sender's ID for reference
        // Add any other necessary fields
      });

      // Call the onForward function to handle any additional logic
      onForward(messageId);
    } catch (error) {
      console.error('Error forwarding message:', error);
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
              onClick={() => handleSelect(chat[1].userInfo.displayName, chat[1].lastMessage?.text)}
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

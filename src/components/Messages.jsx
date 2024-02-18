import { doc, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";


const Messages = ({ message }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [messageOptions, setMessageOptions] = useState({});

  const handleToggleOptions = (messageId) => {
    setMessageOptions((prevOptions) => ({
      ...prevOptions,
      [messageId]: !prevOptions[messageId],
    }));
  };


  const handleDelete = async (messageId) => {
    try {
      // Delete the message from the Firestore database
      await deleteDoc(doc(db, "chats", data.chatId, "messages", messageId));
      console.log("Message deleted successfully");

      setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, text: "This message was deleted" } : msg
      )
    );

      // Set a flag to indicate that the message was deleted
      setMessageOptions((prevOptions) => ({
        ...prevOptions,
        [messageId]: true,
      }));
      // setShowOptions(false);
      handleToggleOptions(messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };


  const handleForward = (messageId) => {
    try {
      // Retrieve the message to forward
      const messageToForward = messages.find((msg) => msg.id === messageId);
  
      // Implement your logic to forward the message to other users
      // For example, you can add the message to the chats of other users using Firestore
  
      // Assuming you have a collection called "users" in your Firestore database
      // You can add the message to the "chats" subcollection of the desired user
      db.collection("users").doc("desiredUserId").collection("chats").add({
        // Assuming each message has a structure like { text: "", sender: "", timestamp: "" }
        text: messageToForward.text,
        sender: messageToForward.sender,
        timestamp: new Date().toISOString(),
      });
  
      console.log("Message forwarded successfully:", messageToForward);
    } catch (error) {
      console.error("Error forwarding message:", error);
    }

  };


  const handleLike = async (messageId) => {
    try {
      // Assuming you have access to the 'messages' state
      const updatedMessages = messages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            likes: (msg.likes || 0) + 1,
          };
        }
        return msg;
      });
  
      // Update the message in the state
      setMessages(updatedMessages);
  
      // Update the message in the database (if needed)
      const messageRef = doc(db, "chats", data.chatId, "messages", messageId);
      await updateDoc(messageRef, {
        likes: updatedMessages.find((msg) => msg.id === messageId).likes,
      });
  
      console.log("Message liked successfully");
    } catch (error) {
      console.error("Error liking message:", error);
      // Handle the error (e.g., show a notification to the user)
    }
  };
  

  const handleDoubleClick = async (messageId) => {
    handleLike(messageId);
   };
  

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
         <div key={m.id} className="message" onDoubleClick={() => handleDoubleClick(m.id)}>
         {/* <div key={m.id} className="message"> */}
          <React.Fragment>
            <div>{m.text}</div>
            <span
              className="like-icon"
              onClick={() => handleLike(m.id)} // Click to like
            >
              {m.likes > 0 && <i className="fas fa-heart"></i>}
            </span>
            <span
              className="three-dots"
              onClick={() => handleToggleOptions(m.id)}
            >
              ...
            </span>
            {messageOptions[m.id] && (
              <div className="options-menu">
                <div className="option" onClick={() => handleDelete(m.id)}>
                  Delete
                </div>
                <div className="option" onClick={() => handleForward(m.id)}>
                  Forward
                </div>
              </div>
            )}
          </React.Fragment>
        </div>
      ))}
    </div>
  );
            }

  export default Messages;
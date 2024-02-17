import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
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
    // Implement your forward functionality here
    console.log("Forwarding message:", messageId);
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
        <div key={m.id} className="message">
          <React.Fragment>
            <div>{m.text}</div>
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
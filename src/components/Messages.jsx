// Messages.js
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../Context/ChatContext';
import { db } from '../firebase';
import { doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import Message from './Message';
import ForwardDialog from './ForwardDialog';

const Messages = ({ message }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [messageOptions, setMessageOptions] = useState({});
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const handleToggleOptions = (messageId) => {
    setMessageOptions((prevOptions) => ({
      ...prevOptions,
      [messageId]: !prevOptions[messageId],
    }));
  };

  const handleDelete = async (messageId) => {
    try {
      // Delete the message from the Firestore database
      await deleteDoc(doc(db, 'chats', data.chatId, 'messages', messageId));
      console.log('Message deleted successfully');

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, text: 'This message was deleted' } : msg
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
      console.error('Error deleting message:', error);
    }
  };

  const handleForward = (messageId) => {
    setSelectedMessageId(messageId);
    setShowForwardDialog(true);
    handleToggleOptions(messageId);
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
      const messageRef = doc(db, 'chats', data.chatId, 'messages', messageId);
      await updateDoc(messageRef, {
        likes: updatedMessages.find((msg) => msg.id === messageId).likes,
      });

      console.log('Message liked successfully');
    } catch (error) {
      console.error('Error liking message:', error);
      // Handle the error (e.g., show a notification to the user)
    }
  };

  const handleDoubleClick = async (messageId) => {
    handleLike(messageId);
    try {
      // Retrieve the message to update
      const messageToUpdate = messages.find((msg) => msg.id === messageId);

      // Update the likes property of the message
      const updatedMessage = {
        ...messageToUpdate,
        likes: (messageToUpdate.likes || 0) + 1,
      };

      // Update the message in the state
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? updatedMessage : msg
      );
      setMessages(updatedMessages);

      // Update the message in the database (if needed)
      const messageRef = doc(db, 'chats', data.chatId, 'messages', messageId);
      await updateDoc(messageRef, {
        likes: updatedMessage.likes,
      });

      console.log('Message liked successfully');
    } catch (error) {
      console.error('Error liking message:', error);
      // Handle the error (e.g., show a notification to the user)
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
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
          <React.Fragment>
            <div>{m.text}</div>
            <span className="like-icon" onClick={() => handleLike(m.id)}>
              {m.likes > 0 && <i className="fas fa-heart"></i>}
            </span>
            <span className="three-dots" onClick={() => handleToggleOptions(m.id)}>
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
      {showForwardDialog && (
        <ForwardDialog
          messageId={selectedMessageId}
          messageText={messages.find((msg) => msg.id === selectedMessageId)?.text}
          onClose={() => setShowForwardDialog(false)}
          onForward={(messageId) => {
            // Implement your logic to forward the message here
            console.log('Forwarding message:', messageId);
            setShowForwardDialog(false);
          }}
        />
      )}
    </div>
  );
};

export default Messages;

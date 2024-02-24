import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../Context/ChatContext';
import { db } from '../firebase';
import { doc, onSnapshot, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import Message from './Message';
import ForwardDialog from './ForwardDialog';
import heart from '../images/heart_like.png';
import { firestore } from '../firebase';
import '../Style.css';


const Messages = ({ message }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const [messageOptions, setMessageOptions] = useState({});
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [likedMessages, setLikedMessages] = useState([]);

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
        prevMessages.filter((msg) => msg.id !== messageId)
      );

      // Set a flag to indicate that the message was deleted
      setMessageOptions((prevOptions) => ({
        ...prevOptions,
        [messageId]: true,
      }));
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
      // Check if the message is already liked
      if (likedMessages.includes(messageId)) {
        // If already liked, remove it from likedMessages
        setLikedMessages(likedMessages.filter((id) => id !== messageId));
      } else {
        // If not liked, add it to likedMessages
        setLikedMessages([...likedMessages, messageId]);
      }

      const messageRef = doc(db, 'chats', data.chatId, 'messages', messageId);
      const messageSnapshot = await getDoc(messageRef);

      if (messageSnapshot.exists()) {
        const updatedLikes = (messageSnapshot.data().likes || 0) + 1;

        await updateDoc(messageRef, { likes: updatedLikes });
        await updateDoc(messageRef, { likedMessages: db.FieldValue.arrayUnion(messageId) });

        console.log('Message liked successfully');
      } else {
        console.error('Error: Message document does not exist');
      }
    } catch (error) {
      console.error('Error liking message:', error);
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
        <div key={m.id} className="message">
          <React.Fragment>
            <div>{m.text}</div>
            <span className="like-icon" onClick={() => handleLike(m.id)}>
              {m.likes > 0 && likedMessages.includes(m.id) && (
                <img src={heart} alt="Like" />
              )}
              {m.likes > 0 && !likedMessages.includes(m.id) && (
                <i className="far fa-heart"></i>
              )}
              {m.likes === 0 && <i className="far fa-heart"></i>}
              {likedMessages.includes(m.id) && <img src={heart} width={10} height={10} alt="Like" />}
            </span>
            <span className="three-dots" onClick={() => handleToggleOptions(m.id)}>
              ...
            </span>
            {messageOptions[m.id] && (
              <div className="options-menu" m>
                <div className="option" onClick={() => handleDelete(m.id)}>
                  Delete
                </div>
                <div className="option" onClick={() => handleForward(m.id)}>
                  Forward
                </div>
                <div className="option" onClick={() => handleLike(m.id)}>
                  Like
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

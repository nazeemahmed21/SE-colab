import React, { useState, useContext } from 'react';
import { AiOutlineFile } from 'react-icons/ai';
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker library

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [gif, setGif] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to manage emoji picker visibility

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try{

      let messagePayload = {
        id: uuid(),
        text,
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


            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
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
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          owner: true,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
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

const handleSelectGif = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=YOUR_GIPHY_API_KEY&limit=1`
    );
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const selectedGif = data.data[0];
      setGif(selectedGif);
    } else {
      console.error("No GIF found for the given search term:", searchTerm);
    }
  } catch (error) {
    console.error("Error selecting GIF:", error);
    // TODO: Handle error, show error message to the user
  }
};


  const handleEmojiClick = (event) => {
    console.log(event.emoji);
       setText(text+event.emoji);
  };
  
  

  return (
    <div className='input'>
    <div className="emoji-picker-container" style={{ display: showEmojiPicker ? 'flex' : 'none' }}>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        navPosition="none"
        searchPosition="none"
        native
        pickerStyle={{
          width: '105px',
          maxHeight: '100px',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          fontSize: '10px'
        }}
        emojiSize={20}
        pickerClassName="custom-emoji-picker"
      />
    </div>
    <input type="text" placeholder='Type Something...' onChange={e => setText(e.target.value)} value={text} />
    <div className="send">
      <label htmlFor="file">
        <AiOutlineFile className='icons' size={24} />
      </label>
      <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
      <span className='icons' style={{ fontSize: '24px' }} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😀
      </span>
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  
  );
};

export default Input;

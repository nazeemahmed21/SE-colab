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
    try {
      // Your existing code for sending messages
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelectGif = (selectedGif) => {
    setGif(selectedGif);
  };


  const handleEmojiClick = (event, emojiObject) => {
    const emoji = emojiObject.emoji;
    console.log(emoji);
    setText(text + emoji); // Insert the selected emoji into the input field
  };
  
  

  return (
    <div className='input'>
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            // disableSearchBar
            // disableSkinTonePicker
            // groupVisibility={{ flags: true }}
            native
            pickerStyle={{ width: 'auto', maxHeight: '100px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
            emojiSize={20}
            pickerClassName="custom-emoji-picker"
          />
        </div>
      )}
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

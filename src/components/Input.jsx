import React, { useState, useContext } from 'react';
import { AiOutlineFile } from 'react-icons/ai';
import { IoAttachOutline } from 'react-icons/io5';
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import GifSelector from './GifSelector';

const Input = () => {
  const[text, setText] = useState('');
  const[img, setImg] = useState(null);
  const [setIsLoading] = useState(false);
  const [gif, setGif] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


  
  const handleSend = async () => {
    try{
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

const handleSelectGif = (selectedGif) => {
  setGif(selectedGif);
};



  return (
    <div className='input'>
           {/* <GifSelector onSelect={handleSelectGif} /> */}
      <input type="text" placeholder='Type Something...' onChange={e => setText(e.target.value)} value={text}/>
      <div className="send">
        <label htmlFor="file">
          <AiOutlineFile className='icons' size={24} />
        </label>
        <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
        <IoAttachOutline className='icons' size={24} />
      
        <button onClick={handleSend}>Send</button>
       
      </div>
 
    </div>
  )
}

export default Input 
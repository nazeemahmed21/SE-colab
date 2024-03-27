import * as markerjs2 from "markerjs2";
import React, {useContext} from "react";
import { useLocation } from "react-router-dom";
import Navbar from './Navbar.js'
import Typography from '@mui/material/Typography';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";
import '../chatStyle.css'

export const  ImageAnnotator = () => {
    const { state } = useLocation();
    const imgRef = React.createRef();
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const showMarkerArea = () => {
      if (imgRef.current !== null) {
        // create a marker.js MarkerArea
        const markerArea = new markerjs2.MarkerArea(imgRef.current);
        // attach an event handler to assign annotated image back to our image element
        markerArea.addEventListener('render', event => {
          if (imgRef.current) {
            imgRef.current.src = event.dataUrl;
          }
        });
        // launch marker.js
        markerArea.show();
      }

    }

    const handleSend = async () => {
      const storageRef = ref(storage, uuid());
      const imageBlob = await fetch(imgRef.current.src).then(res => res.blob());

      uploadBytes(storageRef, imageBlob).then(async (snapshot) => {
          try {
            const downloadURL = await getDownloadURL(snapshot.ref);

            await updateDoc(doc(db, "chatMessages", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: "Image",
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            navigate("/messages");
          }
        }
      );
    }

    return (
        <div className='homeContainer'>
          <Navbar/>
          <div className=' chatsHome'>
            <div className='chatsContainer'>
              <Typography variant='h5'>
                Click the image below to annotate it.
              </Typography>
              <img ref={imgRef} style={{ margin: 100, maxHeight: "50%", maxWidth: "50%" }} src={state} onClick={() => showMarkerArea()} />
              <button
  className="annotationSendButton"
  style={{
    maxHeight: "5%",
    padding: "10px 20px", // Adjust button padding
    borderRadius: "5px", // Adjust button border radius
    backgroundColor: "#12ab99", // Background color
    color: "white", // Text color
    fontSize: "16px", // Font size
    border: "none", // Remove button border
    cursor: "pointer" // Add pointer cursor on hover
  }}
  onClick={handleSend}
>
  Send Image
</button> </div>
        </div>
        </div>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import { storage, db } from '../../firebase'; // Your Firebase config
import { doc, setDoc, updateDoc, addDoc } from 'firebase/firestore'; 
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import '../../styles/labs.css'; 
import { collection, arrayUnion } from 'firebase/firestore';
import ModalClose from '@mui/joy/ModalClose';
import './modal.css';


const CreateLab = () => {
  const [open, setOpen] = React.useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [labName, setLabName] = useState('');
  const [labIcon, setLabIcon] = useState(null);
  const [ownerId, setOwnerId] = useState(''); // Get this from authentication
  const navigate = useNavigate(); // Initialize the hook
  const [labIconPreview, setLabIconPreview] = useState(null);
  const [defaultIconUrl, setDefaultIconUrl] = useState(null);
  const fileInputRef = useRef(null); 

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setOwnerId(currentUser.uid);
    } else {
      // Handle the case when user is not authenticated (redirect to login?)
    }
    // Fetch default icon from Firebase Storage
    const fetchDefaultIcon = async () => {
      const storage = getStorage();
      const defaultIconRef = ref(storage, 'gs://final-colab.appspot.com/labIcons/DefaultIcon/labimg.png');

      try {
        const url = await getDownloadURL(defaultIconRef);
        setLabIconPreview(url);
        setDefaultIconUrl(url);
      } catch (error) {
        console.error('Error fetching default lab icon:', error);
      }
    };
    fetchDefaultIcon();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let labIconUrl = '';
    let tempLabIcon = null; // Store the icon temporarily

    if (labIcon) {
        tempLabIcon = labIcon; // Store it if an icon is selected
    }
    const joinId = generateJoinId();
    try {
      const labsRef = await addDoc(collection(db, 'labs'),{
        labName,
        ownerID: ownerId,
        joinId,  
      });
    

      // Upload the icon if it was selected
    if (tempLabIcon) {
      const imageRef = ref(storage, `labIcons/${labsRef.id}.jpg`); 
      await uploadBytes(imageRef, tempLabIcon);
      const labIconUrl = await getDownloadURL(imageRef);

      // Update the Firestore document with the labIcon URL
      await updateDoc(labsRef, {
          labIcon: labIconUrl
      }); 
  }

      console.log('Lab data written successfully!'); // Success logging
      console.log("Document written with ID: ", labsRef.id);
      // Reset the form 
      setLabName('');
      setLabIcon(null);
      setOpen(false);
      setModalClosed(true);

      // Handle success
      console.log('Lab created successfully!');
      // Add owner to members subcollection
      const membersRef = collection(db, 'labs', labsRef.id, 'members');
      const ownerMemberRef = doc(membersRef); 
      await setDoc(ownerMemberRef, {
          userId: ownerId,
          isOwner:true,
          isMod: true
      });
      const userDocRef = doc(db, 'Users', ownerId); 
        await updateDoc(userDocRef, {
            myLabs: arrayUnion(labsRef) 
        }); 
      navigate(`/labs/${labsRef.id}`); //'/labs/:labId' route
    } catch (error) {
      console.error('Error creating lab:', error);
    }
  
  };

      // Helper function for Join ID generation
      function generateJoinId() {
        Math.random = (seed => () => {
          seed = (seed * 9301 + 49297) % 233280; 
          return seed / 233280.0; 
      })(Date.now()); // Get the current timestamp
        const length = 10; 
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnnopqrstuvwxyz';
        let result = '';

        for (let i = 0; i < length; i++) {
             result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }



  return (
    <React.Fragment>
      <button onClick={() => setOpen(true)}>Create New Lab</button> 
      <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={(theme) => ({
            [theme.breakpoints.only('xs')]: {
              top: 'unset',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: 'none',
              maxWidth: 'unset',
            },
          })}>
          <ModalClose variant="plain" sx={{ m: 1}} />
          <DialogTitle sx={{ fontSize: '24px', display: 'flex', justifyContent: 'center', paddingTop:'10px' }}>Create a New Lab</DialogTitle>
          <DialogTitle sx={{ fontSize: '15px', display: 'flex', justifyContent: 'center', textAlign: 'center', fontWeight: 100 }}>Create a new 'Co-Lab'borative Space and start working with others</DialogTitle>
          <DialogContent> 
            <form onSubmit={handleSubmit}> 
              <Stack spacing={3}>
              <FormControl>
                <div className = "preview">
                {labIconPreview && (<div className="lab-icon-preview-container" >
                                        <img src={labIconPreview} alt="Lab Icon Preview" />
                                      </div> )}
                </div>
                  <FormLabel sx={{ fontSize: '14px' }} >Lab Icon (Optional)</FormLabel>
                  <div className = "uploadLabIcon">
                  <input  accept="image/*" type="file" id="labIconSelect" ref={fileInputRef} onChange={(e) => { 
                        // Create preview URL
                        const file = e.target.files[0];
                        if (file && file.type.startsWith('image/'))  {
                            setLabIcon(file); 
                            const fileReader = new FileReader();
                            fileReader.onload = function(event) {
                                setLabIconPreview(event.target.result); 
                            };
                            fileReader.readAsDataURL(file);
                          }else {
                            // Handle invalid file type
                            console.error('Invalid file type. Please select an image.');
                            setLabIcon(null); // Clear the previous image
                            setLabIconPreview(defaultIconUrl); // Reset the preview 
                            fileInputRef.current.value = '';
                            alert("Please select an image file"); // Provide user feedback
                        }
                    }}
                     />
                     </div>
                </FormControl>
                <FormControl>
                  <FormLabel sx={{ fontSize: '14px' }}>Name</FormLabel>
                  <Input sx={{ 
                      fontSize: '12px',
                      border: 0, // Remove default border
                      borderBottom: '2px solid transparent',
                      backgroundColor: '#f0f0f0', // Light gray background color
                      paddingY: '10px',
                      '&::before': {
                        display: 'none',
                      },
                      '&:focus-within': {
                        outline: '0px',
                        outlineOffset: '2px',
                        borderBottom: '2px solid #fd9752', // Add a subtle bottom border
                      },
                      width:'98%'
                  }}
                    placeholder='Enter Lab Name'
                    autoFocus 
                    required 
                    value={labName} 
                    onChange={(e) => setLabName(e.target.value)} 
                  />
                </FormControl>
                <div className="modalSubmit"><Button type="submit" sx={{ '&::before': {
                        display: 'none',
                      },fontSize: '14px', maxWidth: '250px',paddingY: '10px',display:'flex',justifyContent:'center'}}>Create Lab</Button></div>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default CreateLab;
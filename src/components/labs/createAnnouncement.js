import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection , getDoc} from 'firebase/firestore'; 
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import ModalClose from '@mui/joy/ModalClose';
import { db } from '../../firebase';
import Textarea from '@mui/joy/Textarea'; 
import './modal.css';
import { useParams } from 'react-router-dom';



const CreateAnnouncement = () => { 
  const [open, setOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState(''); 
  const [announcementText, setAnnouncementText] = useState('');
  const navigate = useNavigate(); 
  const [userId, setUserId] = useState('');
  const [labId, setLabId] = useState('');
  const { labId: urlLabId } = useParams();
  

  useEffect(() => {
    const currentUser = auth.currentUser;
    setLabId(urlLabId);
    console.log("labId:", labId);
    if (currentUser) {
      setUserId(currentUser.uid);
      
    } else {
      // Handle the case when user is not authenticated (redirect to login?)
    }
  }, [labId, urlLabId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!labId) {
      console.error('Lab ID is required'); 
      return; 
    }

    try {
      const announcementsRef = collection(db, 'labs', labId, 'announcements'); // Collection name update
      await setDoc(doc(announcementsRef), {
          title: announcementTitle, 
          text: announcementText,
          timestamp: new Date(),
          createdBy: userId 
      });


      setAnnouncementTitle('');
      setAnnouncementText('');
      setOpen(false); 

    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <React.Fragment>
      <button onClick={() => setOpen(true)}>Create Announcement</button> 
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog 
          sx={(theme) => ({
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
          <ModalClose 
            variant="plain" 
            sx={{ 
              position: 'absolute',
              top: 10,
              right: 10
            }} 
          />

          <DialogTitle id="create-announcement-dialog-title" sx={{ fontSize: '20px', display: 'flex', justifyContent: 'center', paddingTop:'10px', paddingX: '50px' }}>
            Add an Announcement
          </DialogTitle> 

          <DialogContent> 
            <form onSubmit={handleSubmit}> 
              <Stack spacing={3}>

                {/* Announcement Title */}
                <FormControl> 
                  <FormLabel sx={{ fontSize: '14px' }}>Announcement Title</FormLabel>
                  <Textarea 
                    sx={{ fontSize: '12px' }}
                    placeholder='Enter a title for your announcement'
                    fullWidth
                    required 
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)} 
                  />
                </FormControl>

                {/* Announcement Text */}
                <FormControl> 
                  <FormLabel sx={{ fontSize: '14px' }}>Announcement Text</FormLabel>
                  <Textarea
                    minRows={3}
                    style={{ width: '98%', fontSize: '12px' }} 
                    placeholder='Describe what you want to discuss...'
                    required 
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)} 
                  />
                </FormControl>
                <div className='modalSubmit'> <button type="submit" id = "submitModal">Add Announcement</button> </div>
               
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default CreateAnnouncement;
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore'; 
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
import { collection } from 'firebase/firestore';
import ModalClose from '@mui/joy/ModalClose';
import { db } from '../../firebase';

import './modal.css';

const JoinLab = () => {
    const [open, setOpen] = React.useState(false);
    const [joinId, setJoinId] = useState('');
    const navigate = useNavigate(); 
    const [userId, setUserId] = useState(''); // Updated: Store just the userId

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserId(currentUser.uid); // Store the user's ID
        } else {
            // Handle the case when user is not authenticated (redirect to login?)
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const labsQuery = query(collection(db, 'labs'), where('joinId', '==', joinId));
            const querySnapshot = await getDocs(labsQuery);

            if (querySnapshot.empty) {
                console.error('Lab not found'); 
                // Handle the case where no lab matches the Join ID
            } else {
                const labDoc = querySnapshot.docs[0]; 
                const labId = labDoc.id;
                const labRef = doc(db, 'labs', labId)
                const membersRef = collection(db, 'labs', labId, 'members');
                const userMemberRef = doc(membersRef); 
                await setDoc(userMemberRef, {
                    userId: userId,
                    isOwner: false,
                    isModerator: false
                });
                const userDocRef = doc(db, 'Users', userId);
                console.log('User ID:', userId);
                console.log('Lab Ref:', labRef); 
                await updateDoc(userDocRef, {
                    myLabs: arrayUnion(labRef) 
                });
                navigate(`/labs/${labId}`);
            }
                

        } catch (error) {
            console.error('Error fetching lab data:', error);
            // Handle error
        }
    };


    return (
        <React.Fragment>
            <button onClick={() => setOpen(true)}>Join Lab</button> 
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
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <DialogTitle sx={{ fontSize: '24px', display: 'flex', justifyContent: 'center', paddingTop:'10px' }}>Join a Lab</DialogTitle>
                    <DialogTitle sx={{ fontSize: '15px', display: 'flex', justifyContent: 'center', textAlign: 'center',fontWeight: 100 }}>Join a 'Co-Lab'borative Space and start working with others</DialogTitle>
                    <DialogContent> 
                        <form onSubmit={handleSubmit}> 
                            <Stack spacing={3}>
                                <FormControl sx={{paddingTop:'15px'}}>
                                    <FormLabel sx={{ fontSize: '14px' }}>Lab URL</FormLabel>
                                    <Input 
                                        sx={{ fontSize: '12px',
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
                                          borderBottom: '2px solid #007bff', // Add a subtle bottom border
                                        },
                                        width:'98%' }}
                                        placeholder='example: xBjdkw2348'
                                        fullWidth
                                        autoFocus
                                        required 
                                        value={joinId}
                                        onChange={(e) => setJoinId(e.target.value)} 
                                    />
                                </FormControl>
                                <Button type="submit">Join Lab</Button>
                            </Stack>
                        </form>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
};

export default JoinLab;
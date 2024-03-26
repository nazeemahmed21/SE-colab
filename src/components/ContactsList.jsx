import React, {useState, useEffect, useContext, useRef} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import {db} from "../firebase";
import { doc, collection, arrayUnion, addDoc, updateDoc, setDoc, getDocs, Timestamp } from "firebase/firestore";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from 'react-router';


export default function ContactsList() {
  const [checked, setChecked] = useState([]);
  const [userData, setUserData] = useState([]);
  const groupNameRef = useRef('');
  const [alert, setAlert] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    async function fetchData() {
        await getDocs(collection(db, "Users"))
        .then((userDocs) => {
            const data = [];
            userDocs.forEach((doc) => {data.push(doc.data())});
    
            setUserData(data);
        });
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (alert != false) {
      setTimeout(1000);
      window.location.reload();
    }
  }, [alert]);

  const getDisplayName = (uid) => {
    let user = userData.find((user) => user.uid === uid);

    return `${user.firstName} ${user.lastName}`;
  }

  const handleCreateGroup = async () => {
    await addDoc(collection(db, "chatMetadata"), {
        date: Timestamp.now(),
        lastMessage: {
            text: ""
        },
        userInfo: {
            indvChat: checked.length==1,
            displayName: checked.length==1 ? getDisplayName(checked[0]) : groupNameRef.current.value
        }
    }).then((chatDoc) => {
        const checkedCopy = checked;
        checkedCopy.push(currentUser.uid);

        checkedCopy.forEach((userId) => {
            setDoc(doc(db, "userChatMapping", userId), {
                chats : arrayUnion(chatDoc.id)
            }, {merge: true});
        });
        setDoc(doc(db, "chatMessages", chatDoc.id), {
            messages: []
        }).then((_) => {
            setAlert(true);
        });
    });
  };

  return (
    <div>
        <Box
        component="form"
        sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
            {alert && <Alert severity="success">The chat was created successfully.</Alert>}
            <TextField id="outlined-basic" label="Chat name for groups" variant="outlined" inputRef={groupNameRef}/>
            <Typography id="modal-modal-title" variant="h6" component="h2">Select people to add to chat:</Typography>
            <List dense sx={{ width: '100%', maxWidth: 360, maxHeight: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
            {userData.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value.uid}`;
                return (
                <ListItem
                    key={value.uid}
                    secondaryAction={
                    <Checkbox
                        edge="end"
                        onChange={handleToggle(value.uid)}
                        checked={checked.indexOf(value.uid) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                    }
                    disablePadding
                >
                    <ListItemButton>
                    <ListItemAvatar>
                        <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={value.pfpURL}
                        />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={`${value.firstName} ${value.lastName}`} />
                    </ListItemButton>
                </ListItem>
                );
            })}
            </List>
            <Button variant="contained" onClick={handleCreateGroup}>Create Chat</Button>
        </Box>
    </div>
  );
}

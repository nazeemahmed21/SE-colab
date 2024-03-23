import React, {useContext,useState} from "react";
import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from '../Context/ChatContext'
import Video from "./Video";
import { Link } from "react-router-dom";
import ContactsList from "./ContactsList";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Chat = () => {
  const { data } = useContext(ChatContext);
  console.log(data);

  const [isVideoVisible, setVideoVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  // const history = useHistory(); // Initialize useHistory

  const handleCamClick = () => {
    setVideoVisible(!isVideoVisible);
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
        <Link to="/video" target="_blank"> 
        <img src={Cam} className='chatImage' alt='chatImage' style={{ width: '60px', height: '60px', marginRight:'20px', marginLeft:'70px' }} />
        </Link>
          <img src={Add} alt="" onClick={handleOpen} />
          <img src={More} alt="" />
        </div>
      
      </div>
      <Messages/>
      <Input/>
      {isVideoVisible && <Video />}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a new chat
          </Typography>
          <ContactsList />
        </Box>
      </Modal>
    </div>
  );
};

export default Chat;



import React, {useContext,useState} from "react";
import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from '../Context/ChatContext'
import Video from "./Video";
import { Link } from "react-router-dom";

const Chat = () => {
  const { data } = useContext(ChatContext);
console.log(data);

const [isVideoVisible, setVideoVisible] = useState(false);
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
        </Link><img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      
      </div>
      <Messages/>
      <Input/>
      {isVideoVisible && <Video />}
    </div>
  );
};

export default Chat;



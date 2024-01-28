// import React, {useContext} from "react";
// import Cam from "../images/cam.png";
// import Add from "../images/add.png";
// import More from "../images/more.png";
// import Messages from "./Messages";
// import Input from "./Input";
// import { ChatContext } from '../Context/ChatContext'



// const Chat = () => {
//   const { data } = useContext(ChatContext);
// // console.log(data);

//   return (
//     <div className="chat">
//       <div className="chatInfo">
//         <span>{data.user?.displayName}</span>
//         <div className="chatIcons">
//           <img src={Cam} alt="" />
//           <img src={Add} alt="" />
//           <img src={More} alt="" />
//         </div>
      
//       </div>
//       <Messages/>
//       <Input/>
//     </div>
//   );
// };

// export default Chat;


import React, {useContext,useState} from "react";
import Cam from "../images/cam.png";
import Add from "../images/add.png";
import More from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from '../Context/ChatContext'
import Video from "./Video";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Chat = () => {
  const { data } = useContext(ChatContext);
console.log(data);
// console.log(data.user?.userInfo?.displayName);

const [isVideoVisible, setVideoVisible] = useState(false);
// const history = useHistory(); // Initialize useHistory

const handleCamClick = () => {
  setVideoVisible(!isVideoVisible);
  // if (!isVideoVisible) {
  //   // Navigate to /video when cam icon is clicked
  //   history.push("/video");
  // }
};
  return (
    <div className="chat">
      {/* <Navbar/> */}
      <div className="chatInfo">

      <span>{data.user?.userInfo?.displayName}</span>
        {/* <span>{data.user?.displayName}</span> */}
        <div className="chatIcons">
        <Link to="/video" target="_blank"> 
            <img src={Cam} alt="" onClick={handleCamClick} />
          </Link>
          <img src={Add} alt="" />
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
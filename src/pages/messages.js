import React from 'react'
import Navbar from '../components/Navbar.js'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'
import Chat from '../components/Chat.jsx'
import '../Style.css'
import call_icon from '../images/call_icon.png'
// import Chats from '../components/Chats.jsx'
// import Search from '../components/Search.jsx'
const Messages = () => {
  return (

    <div className='homeContainer'>
            <Navbar/>
      <div className='home'>
 
    
      <div className='container'>
      <Sidebar />
      {/* <div className='chatContainer'> */}
        <Chat />
        </div>
        <img src={call_icon} className='chatImage' alt='chatImage'/>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Messages
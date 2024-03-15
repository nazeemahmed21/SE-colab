import React from 'react'
import Navbar from '../components/Navbar.js'
import Sidebar from '../components/Sidebar.jsx'
import Chat from '../components/Chat.jsx'
import '../Style.css'
import call_icon from '../images/call_icon.png'
import { Link } from "react-router-dom";

const Messages = () => {
  return (

    <div className='homeContainer'>
            <Navbar/>
      <div className=' chatsHome'>
 
    
      <div className='chatsContainer'>
      <Sidebar />

        <Chat />
        </div>

        <div className='call_icon_main'>
        <Link to="/video" target="_blank"> 
        <img src={call_icon} className='chatImage' alt='chatImage' style={{ width: '60px', height: '60px', marginRight:'20px', marginLeft:'70px' }} />
        </Link>
</div>

      </div>
    </div>
  )
}

export default Messages
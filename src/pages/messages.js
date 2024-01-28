import React from 'react'
import Navbar from '../components/Navbar.js'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'
import Chat from '../components/Chat.jsx'
import '../Style.css'
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
        {/* </div> */}
      </div>
    </div>
  )
}

export default Messages
import React from 'react'
import Navbar from '../components/Navbar.js'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'
import Chat from '../components/Chat.jsx'
import Chats from '../components/Chats.jsx'
import Search from '../components/Search.jsx'
const Messages = () => {
//   const navigate = useNavigate();

//   const redirectToHome = () => {
//     // Redirect to Home component
//     navigate('/C:/Users/fathi/OneDrive/Desktop/Uni_So/Software-Engineering-GRP/src/components/IndvChats/Home.jsx'); // Replace with the actual path
//   };

//   return (
//     <div>
//       {/* <Navbar /> */}
//       <h1>Individual Messages</h1>
//       <button onClick={redirectToHome}>Go to Home</button>
//     </div>
//   )
// }

// export default Messages



// const Home = () => {
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar />
        {/* <Search/> */}
         {/* <Navbar/> */}
         {/* <Chats/> */}
        <Chat />
      </div>
    </div>
  )
}

export default Messages
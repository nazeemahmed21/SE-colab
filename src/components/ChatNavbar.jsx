import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase';
import { AuthContext } from '../Context/AuthContext';
import '../Style.css'
const Navbar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className='ChatNavbar'>
      <span className='logo'>Co-Lab Chats</span>
      <div className='user'>
        <img src={currentUser.photoURL} alt="" />
        <span className='userChatName'> {currentUser.displayName } </span>
        {/* <button onClick={() => signOut(auth)}>Log Out </button> */}
      </div>
    </div>
  )
}

export default Navbar
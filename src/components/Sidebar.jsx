import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import ChatsNavbar from './ChatNavbar'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ChatsNavbar />
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar
import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
// import * as FiIcons from 'react-icons/fi';
import * as BiIcons from "react-icons/bi";
export const SidebarData = [
  {
    title: 'Home',
    path: '/home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nb-nav-text'
  },
  {
    title: 'Labs',
    path: '/labs',
    icon: <FaIcons.FaFlask />,
    cName: 'nb-nav-text'
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <BiIcons.BiSolidMessageSquare/>,
    cName: 'nb-nav-text'
  },
  {
    title: 'Toolbox',
    path: '/toolbox',
    icon: <FaIcons.FaToolbox />,
    cName: 'nb-nav-text'
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nb-nav-text'
  }, 
  // {
  //   title: 'User Profile',
  //   path: '/user-prof',
  //   icon: <FaIcons.FaRegUserCircle/>,
  //   cName: 'nb-nav-text'
  // },
]
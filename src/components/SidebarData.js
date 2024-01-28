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
    cName: 'nav-text'
  },
  {
    title: 'Labs',
    path: '/labs',
    icon: <FaIcons.FaFlask />,
    cName: 'nav-text'
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <BiIcons.BiSolidMessageSquare/>,
    cName: 'nav-text'
  },
  {
    title: 'Toolbox',
    path: '/toolbox',
    icon: <FaIcons.FaToolbox />,
    cName: 'nav-text'
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text'
  }
]
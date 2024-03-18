import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../styles/navbar.css';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";
import { CiSearch } from "react-icons/ci";
import { IconContext } from 'react-icons'
import { auth } from '../firebase';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { IoNotificationsCircle } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

function Navbar({ darkMode }) {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    secondname: '',
    ProfPic: '',
    Role: '',
  });

  useEffect(() => {
    const navOptionMenu = document.querySelector(".nav_select_menu");
    const navSelectBtn = navOptionMenu.querySelector(".nav_select_btn");

    const toggleMenu = () => {
      navOptionMenu.classList.toggle("active");
    };

    navSelectBtn.addEventListener("click", toggleMenu);

    // Cleanup event listener when component unmounts
    return () => {
      navSelectBtn.removeEventListener("click", toggleMenu);
    };
  }, []); // Empty dependency array to run once after component mount

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = doc(db, 'Users', userId);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstname: userData.firstName || '',
            secondname: userData.lastName || '',
            ProfPic: userData.pfpURL,
            Role: userData.role || '',
          });

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search for:', search);
  };

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className={`nav-body ${darkMode ? 'orange-navbar' : ''}`}>
        <IconContext.Provider value={{ color: '#000 ' }}>
          <div className='navbar'>
          </div>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className='search-button'><CiSearch size={25} /></div>
          </form>
          <div className='sign-out-for-mobile'>
            <button className='lonely' onClick={handleSignOut}><FaSignOutAlt size={30} color='black' background-color="transparent" /></button>
          </div>
          <div className='mob-logo'>
            <img src={logo} alt='logo' />
          </div>
          <div className='mob-notif'>
            <IoNotificationsCircle size={50} color='#29ada0' />
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
              <li className='navbar-toggle'>
                <div className='nav-logo'>
                  <img src={logo} alt='logo' />
                </div>
                <div className='pfp-logo'>
                  <img className='profile-pic' src={userInfo.ProfPic} alt='profile pic' />
                </div>
                <div className='nav_select_menu'>
                  <IoIosArrowDropdownCircle size={50} color='#29ada0' className='nav_select_btn' />
                  <ul className='nav_options'>
                    <li className='nav_option'>
                      <Link to="/user-prof"><MdOutlineManageAccounts color='#29ada0'/></Link>
                      <Link to="/user-prof"><span className="nav_option_text">Account Settings</span></Link>
                    </li>
                    <li className='nav_option'>
                      <Link to="/settings"><IoIosSettings color='#29ada0'/></Link>
                      <Link to="/settings"><span className="nav_option_text">Settings</span></Link>
                    </li>
                  </ul>
                </div>
                <div className='prof-notif'>
                  <IoNotificationsCircle size={50} color='#29ada0' />
                </div>
              </li>
              <div className='sign-out-box'>
                <div className='sign-out-icon'>
                  <FaSignOutAlt size={25} color='white' />
                </div>
                <button className='sign-out-button' onClick={handleSignOut}>Sign Out</button>
              </div>
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path} className='icon-items'>
                      <span className="icon-wrapper">{item.icon}</span>
                      <span className="icon-title">{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </IconContext.Provider>
      </div>
    </>
  )
}

export default Navbar;

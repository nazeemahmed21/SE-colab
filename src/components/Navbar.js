import React, {useState, useEffect} from 'react'
// import * as FaIcons from "react-icons/fa";
// import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../styles/navbar.css';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// import './Navbar.css'
import logo from "../images/logo.png";
import { CiSearch } from "react-icons/ci";
import { IconContext } from 'react-icons'
import { auth } from '../firebase';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { IoNotificationsCircle } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
// import navbg from "../images/bg.gif"  
// import { uploadBytes } from 'firebase/storage';
// import { getDownloadURL } from 'firebase/storage';
// import { updateDoc } from 'firebase/firestore';
// import { storage } from '../firebase';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();
  // const [imageUpload] = useState(null);
  const [search, setSearch] = useState(''); // State for the search input
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    secondname: '',
    ProfPic: '',
    Role: '',
  });
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/'); // Replace '/' with your landing page route
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
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  // const uploadImage = async () => {
  //   if (imageUpload == null) return;
  //   const currentUser = auth.currentUser;
  //   const userId = currentUser.uid;

  //   const imageRef = ref(storage, `user-profiles/${userId}/profile-img`);

  //   try {
  //     await uploadBytes(imageRef, imageUpload);
  //     alert("Image Uploaded");

  //     const url = await getDownloadURL(imageRef);
  //     const userRef = doc(db, "Users", userId);

  //     // Use the updateDoc function to update the 'pfpURL' field without affecting other fields
  //     await updateDoc(userRef, {
  //       pfpURL: url
  //     });

  //     // Update the ProfPic in state with the uploaded image URL
  //     setUserInfo((prevState) => ({
  //       ...prevState,
  //       ProfPic: url,
  //     }));
  //   } catch (error) {
  //     console.error("Error uploading image or updating document:", error);
  //   }
  // };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handler for search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search for:', search);
    // Add your search logic here
  };
  const showSidebar = () => setSidebar(!sidebar)
  return (
    <>
      <div className='nav-body'>
        {/* <img src={navbg} alt=''/> */}
    <IconContext.Provider value={{ color: '#000 '}}>
        <div className='navbar'>
          {/* <p>First Name: {userInfo.firstname}</p>
          <p>Last Name: {userInfo.secondname}</p>
          <p>Role: {userInfo.Role}</p>   */}
      {/* <Link to = '#' className='menu-bars'>
        <FaIcons.FaBars onClick={showSidebar}/>
      </Link> */}
          </div>
          <form onSubmit={handleSearchSubmit} className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
            />
            <div className='search-button'><CiSearch size={25}/></div>
          </form>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            {/* <Link to="#" className='menu-bars'>
              <FaIcons.FaBars />  
            </Link> */}
            <div className='nav-logo'>
                <img src={logo} alt='logo' />
            </div>
            <div className='pfp-logo'>
              <img className='profile-pic' src={userInfo.ProfPic} alt='profile pic' /> 
            </div>
            <div className='prof-name'>      
              <p className='userInformation1'>{userInfo.firstname},</p>
            </div>
            <div className='prof-role'>    
              <p className='userInformation'>{userInfo.Role}</p>
            </div>
            <div className='prof-notif'>
              <IoNotificationsCircle size={50} color='#29ada0'/>    
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
                  <span>{item.title}</span>
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

export default Navbar
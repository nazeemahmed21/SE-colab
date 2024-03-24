import React, {useState, useEffect} from 'react';
import { Link, NavLink } from 'react-router-dom';
import './labNavbar.css';
import { LeaveLab } from './labUtils';
import { useNavigate } from 'react-router-dom';
import bmenu from './img/bmenu.svg'

export const LabNavbar = ({ labId, isTheLabOwner, currentUserId}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleLeaveLab = () => {
        LeaveLab(labId, currentUserId, navigate); // Assume you have currentUserId and navigate available
      };
    const toggleNavbar = () => {
        if (window.innerWidth <= 940){
            setIsOpen(!isOpen);
        }
        else{

        }
        
      };
    
      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth >= 940) {
            setIsOpen(true); // Force open on larger screens
          } else {
            setIsOpen(false); // Allow closing on smaller screens if toggled
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize(); // Call initially for correct setup
    
        return () => window.removeEventListener('resize', handleResize);
      }, []); 
    
    return (
        <div>
         <div className = "lab-menu-icon" onClick={toggleNavbar}>
            <img src={bmenu} alt = ""/>
        </div>   
        <div className={`lab-navbar ${isOpen ? 'is-open' : ''}`}  style={{ display: isOpen ? 'flex' : 'none' }}> {/* Add Main Navbar Container */}
            <ul>
                <NavLink to={`/labs/${labId}`} end ><li onClick={toggleNavbar}>Announcements</li></NavLink>
                <NavLink to={`/labs/${labId}/members`}exact><li onClick={toggleNavbar}>Lab Members</li></NavLink>
                <NavLink to={`/labs/${labId}/files`}><li onClick={toggleNavbar}>Lab Files</li></NavLink>
                {!isTheLabOwner && (<Link to="#" onClick={handleLeaveLab} end><li onClick={toggleNavbar}>Leave Lab</li></Link>)}
                {isTheLabOwner && (
                <NavLink to={`/labs/${labId}/settings`}><li onClick={toggleNavbar}>Manage Lab</li></NavLink>)}   
            </ul>
        </div>
        </div>
    );
};

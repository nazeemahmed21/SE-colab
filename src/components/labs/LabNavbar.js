import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './labNavbar.css';
import { LeaveLab } from './labUtils';
import { useNavigate } from 'react-router-dom';

export const LabNavbar = ({ labId, isTheLabOwner, currentUserId}) => {
    const navigate = useNavigate();
    const handleLeaveLab = () => {
        LeaveLab(labId, currentUserId, navigate); // Assume you have currentUserId and navigate available
      };

    return (
        <div className="lab-navbar"> {/* Add Main Navbar Container */}
            <ul>
                <NavLink to={`/labs/${labId}`} end ><li>Lab Files</li></NavLink>
                <NavLink to={`/labs/${labId}/members`}exact><li>Lab Members</li></NavLink>
                <NavLink to={`/labs/${labId}/announcements`}><li>Announcements</li></NavLink>
                <Link to="#" onClick={handleLeaveLab} end><li>Leave Lab</li></Link>
                {isTheLabOwner && (
                <NavLink to={`/labs/${labId}/settings`}><li>Manage Lab</li></NavLink>)}   
            </ul>
        </div>
    );
};

import React from 'react';
import { Link } from 'react-router-dom';
import './labNavbar.css';

export const LabNavbar = ({ labId }) => {
    return (
        <div className="lab-navbar"> {/* Add Main Navbar Container */}
            <ul>
                <li><Link to={`/labs/${labId}`}>Lab Files</Link></li> 
                <li><Link to={`/labs/${labId}/members`}>Lab Members</Link></li>
                <li><Link to={`/labs/${labId}/announcements`}>Announcements</Link></li>
                <li>Leave Lab</li> 
                <li><Link to={`/labs/${labId}/settings`}>Manage Lab</Link></li>   
            </ul>
        </div>
    );
};

import React , { useEffect } from 'react';
import '../../styles/labsnew.css';
import { useOutletContext } from 'react-router';
import CreateAnnouncement from '../../components/labs/createAnnouncement';

const LabAnnouncements = () => {
  const [currentPageName,setCurrentPageName] = useOutletContext();
  useEffect(() => {
    setCurrentPageName('Announcements'); 
  }, [setCurrentPageName]);
  
  return (
    <div>
        <CreateAnnouncement/>
    </div>
  );
};

export default LabAnnouncements;
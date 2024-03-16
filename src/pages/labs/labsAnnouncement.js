import React , { useEffect } from 'react';
import '../../styles/labsnew.css';
import { useOutletContext } from 'react-router';

const LabAnnouncements = () => {
  const [currentPageName,setCurrentPageName] = useOutletContext();
  useEffect(() => {
    setCurrentPageName('Announcements'); 
  }, [setCurrentPageName]);
  return (
    <div>

    </div>
  );
};

export default LabAnnouncements;
import React, { useEffect} from 'react';
import '../../styles/labsnew.css';
import { useOutletContext} from 'react-router';
import CreateAnnouncement from '../../components/labs/createAnnouncement';
import ViewAnnouncements from '../../components/labs/viewAnnouncements';


const LabAnnouncements = () => {
  const [currentPageName, setCurrentPageName] = useOutletContext();
  const [isLabOwner, setIsLabOwner] = useOutletContext();

  useEffect(() => {
    setCurrentPageName('Announcements'); 
  }, [setCurrentPageName]);

  return (
    <div>
      {isLabOwner && (<CreateAnnouncement/> )}
      <ViewAnnouncements/>
    </div>
  );
};

export default LabAnnouncements;
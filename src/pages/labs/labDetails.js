import React , { useEffect } from 'react';
import '../../styles/labsnew.css';
import { useOutletContext } from 'react-router';
import FileSystem from '../../components/labs/FileSystem';

const LabDetails = () => {
  const [currentPageName,setCurrentPageName, isLabOwner, labId] = useOutletContext();
  useEffect(() => {
    setCurrentPageName('Lab Files'); 
  }, [setCurrentPageName]);
  return (
    <div>
        <FileSystem labId = {labId}/>
    </div>
  );
};

export default LabDetails;
import React , { useEffect } from 'react';
import '../../styles/labsnew.css';
import { useOutletContext } from 'react-router';

const LabDetails = () => {
  const [currentPageName,setCurrentPageName] = useOutletContext();
  useEffect(() => {
    setCurrentPageName('Lab Details'); 
  }, [setCurrentPageName]);
  return (
    <div>
        <h1></h1>
    </div>
  );
};

export default LabDetails;
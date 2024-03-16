import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/labsnew.css';
import { useParams } from 'react-router-dom';
import { doc } from 'firebase/firestore';
import { db , auth } from '../../firebase';
import { LabNavbar } from '../../components/labs/LabNavbar';
import { onSnapshot } from 'firebase/firestore';
import defaultIcon from '../../images/lab-default-icon.jpg';


const LabLayout = () => {
  const [labIconUrl, setLabIconUrl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [labData, setLabData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { labId } = useParams();
  const [isLabOwner, setIsLabOwner]= useState(false);
  const [currentPageName, setCurrentPageName] = useState("Home"); // Default page name

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
    }
    const fetchLabDetails = async () => {
      setIsLoading(true);
      
      try {
        const labRef = doc(db, 'labs', labId);
        // Real-time listener
        const unsubscribe = onSnapshot(labRef, (labSnap) => {
          if (labSnap.exists()) {
            const data = labSnap.data();
            setLabData(data);
            if (data.ownerID === currentUserId) {
              setIsLabOwner(true); 
          } else {
              setIsLabOwner(false); 
          }
            // Update icon URL directly
            if (data.labIcon) {
              setLabIconUrl(data.labIcon);
            } else {
              setLabIconUrl(defaultIcon); 
            }
          } else {
            setError('Lab not found');
          }
        }, (error) => { // Handle errors for the listener
          setError('Error fetching lab details:', error); 
        });

        // Cleanup function for the listener
        return () => unsubscribe(); 

      } catch (error) {
        setError('Error fetching lab details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabDetails();


  }, [labId, currentUserId, labData, setIsLabOwner, isLabOwner]);


  return (
    <div>
      <Navbar />
      <div className='labsPageMain'>
        {/* Labs */}
        <div className="LabsContent">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {labData && (
            <div className='labsWrapper'>
              <div className='labNavbarSection'>
                <div className="labsArrowContainer">
                  <Link to="/labs">
                    <span className='labsBack-arrow'>←</span>
                  </Link>
                </div>
                <LabNavbar labId={labId} isTheLabOwner={isLabOwner}/>
              </div>
              <div className='labsBody'>
                <div className="labInfo">
                  <div className="labIconContainer">
                    {labIconUrl && <img src={labIconUrl} alt={labData.labName} />}
                  </div>
                  <h1>{labData.labName}</h1><h2> ❯&nbsp;&nbsp;&nbsp;{currentPageName}</h2>
                </div>
                <div className="labsComponents">
                <Outlet context = {[currentPageName,setCurrentPageName]}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabLayout;
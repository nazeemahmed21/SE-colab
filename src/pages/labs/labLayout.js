import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/labsnew.css';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming your Firestore instance is in 'firebase.js'
import { LabNavbar } from '../../components/labs/LabNavbar';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { onSnapshot } from 'firebase/firestore';


const LabLayout = () => {
  const [labIconUrl, setLabIconUrl] = useState(null);
  const [labData, setLabData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { labId } = useParams();

  useEffect(() => {
    const fetchLabDetails = async () => {
      setIsLoading(true);

      try {
        const labRef = doc(db, 'labs', labId);

        // Real-time listener
        const unsubscribe = onSnapshot(labRef, (labSnap) => {
          if (labSnap.exists()) {
            const data = labSnap.data();
            setLabData(data);

            // Update icon URL directly
            if (data.labIcon) {
              setLabIconUrl(data.labIcon);
            } else {
              fetchDefaultIcon(); 
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

    const fetchDefaultIcon = async () => {
      const storage = getStorage();
      // Using a more descriptive path for the default icon
      const defaultIconRef = ref(storage, 'gs://final-colab.appspot.com/labIcons/DefaultIcon/labimg.png');

      try {
        const url = await getDownloadURL(defaultIconRef);
        setLabIconUrl(url);
      } catch (error) {
        console.error('Error fetching default lab icon:', error);
      }
    };

    fetchLabDetails();
  }, [labId]);


  return (
    <div>
      <Navbar />
      <div className='labsPageMain'>
        {/* Navigation Arrow */}

        
        {/* Labs */}
        <div className="LabsContent">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {labData && (
            <div className='labsWrapper'>
                <div className="labsArrowContainer">
                <Link to="/labs">
                  <span className='labsBack-arrow'>←</span>
                </Link>
              </div>
              <div className='labNavbarSection'>
                <LabNavbar labId={labId} />
              </div>
              <div className='labsBody'>
                <div className="labInfo">
                  <div className="labIconContainer">
                    {labIconUrl && <img src={labIconUrl} alt={labData.labName} />}
                  </div>
                  <h1>{labData.labName}</h1>
                </div>
                <div className="labsComponents">
                    <Outlet/>
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
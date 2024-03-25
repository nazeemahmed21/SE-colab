import {getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore'; 
import { db } from '../../firebase'; // Your Firestore instance
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import './mylabs.css';

const MyLabs = () => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = auth.currentUser; // Assuming you've fetched the current user

  useEffect(() => {
    
    const fetchMyLabs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        
        const userDocRef = doc(db, 'Users', currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const myLabRefs = userDocSnapshot.data().myLabs;

          const fetchedLabs = await Promise.all(myLabRefs.map(labRef => getDoc(labRef)));
            const myLabs = fetchedLabs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLabs(myLabs);
        } else {
            setError('User document not found'); 
        }
      } catch (error) {
        setError('Error fetching labs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const cleanupMyLabs = async () => { 
      try {
          const userDocRef = doc(db, 'Users', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
              const myLabRefs = userDocSnapshot.data().myLabs;
              const invalidRefs = [];

              await Promise.all(myLabRefs.map(async (labRef) => {
                  const labDocSnapshot = await getDoc(labRef);
                  if (!labDocSnapshot.exists()) {
                      invalidRefs.push(labRef); 
                  }
              }));

              if (invalidRefs.length > 0) {
                  await updateDoc(userDocRef, {
                      myLabs: arrayRemove(...invalidRefs) 
                  });
              }
          }
      } catch (error) {
          console.error('Error cleaning up myLabs:', error);
      }
  };

    if (currentUser) { // Fetch only if the user is logged in
      cleanupMyLabs();
      fetchMyLabs(); 
    } 
  }, [currentUser]); // Fetch again if the user changes


  return (
    <div className="labs-grid"> {/* Add a container div */}
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}


        {labs.map((lab) => (
             <Link to={`/labs/${lab.id}`}><div key={lab.id} className="lab-box"> {/* Add divs for each lab */}
                    <h3>{lab.labName}</h3> 
            </div>
            </Link>
        ))}
                {/* Check for labs */}
                {!isLoading && labs.length === 0 && (
                <p>You don't have any labs yet. Create or join one to Co-Laborate</p>
            )}
    </div>
);
};

export default MyLabs;
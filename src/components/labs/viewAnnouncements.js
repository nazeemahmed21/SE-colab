import React, { useEffect, useState } from 'react';
import '../../styles/labsnew.css';
import {useParams} from 'react-router';
import { collection, getDocs, orderBy, query, limit, getDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { db, auth } from '../../firebase'; 


const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [labId, setLabId] = useState(''); // Add state for labId
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { labId: urlLabId } = useParams();
  const [userId, setUserId] = useState('');
  const [labOwnerId, setLabOwnerId] = useState('');
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    } else {
      //nav
    }
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      // 1. Get labId if available (e.g., from URL params)
      if (urlLabId) {
        setLabId(urlLabId);
      }

      // 2. Fetch Announcements (Assuming you have the labId)
      if (labId) {
        setIsLoading(true);
        setError(null);

        try{
        const announcementsRef = collection(db, 'labs', labId, 'announcements');
        const q = query(announcementsRef, orderBy('timestamp', 'desc'), limit(10)); // Modify the limit value as needed

        const querySnapshot = await getDocs(q);
        const fetchedAnnouncements = await Promise.all(querySnapshot.docs.map(async (doc) => { 
          const userData = await fetchUserData(doc.data().createdBy);
          return {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(), // Convert timestamp
            createdBy: userData 
          };
        })); 

        setAnnouncements(fetchedAnnouncements); 
      } catch (error) {
        setError('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
      try {
        const labRef = doc(db, 'labs', labId); 
        const labSnap = await getDoc(labRef);

        if (labSnap.exists()) {
          setLabOwnerId(labSnap.data().ownerID);
        } else {
          console.error('Lab document not found'); 
        }
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    }
  };

  fetchAnnouncements(); 
}, [labId, urlLabId]); // Add dependencies

async function handleDeleteConfirmation(announcementId) {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const announcementRef = doc(db, 'labs', labId, 'announcements', announcementId);
        await deleteDoc(announcementRef);
  
        // Update local state to remove the deleted announcement
        setAnnouncements(announcements.filter(ann => ann.id !== announcementId));
      } catch (error) {
        setError('Error deleting announcement:', error);
      }
    }
  }

  async function fetchUserData(userId) {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        console.log('user id:',userId);

        if (userSnap.exists()) {
            return {
                id: userId,
                firstname: userSnap.data().firstName,
                lastname: userSnap.data().lastName, 
                
            };
        } else {
            return {
                id: userId,
                firstname: 'Unknown User'
            };
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            id: userId,
            firstname: 'Error Fetching User'
            
        };
       
    }
}


return (
    <div>
    {isLoading && <p>Loading announcements...</p>}
    {error && <p>Error: {error}</p>}

    {announcements.length > 0 ? (
      <div className="announcements-container">
        {announcements.map((announcement) => (
          <div className="announcement-card" key={announcement.id}>
            <h3>{announcement.title}</h3>
            <p>{announcement.text}</p>
            <div className="meta-info">
              <p className="creator">
                Created by: {announcement.createdBy.firstname}{" "}
                {announcement.createdBy.lastname}
              </p>
              <p className="timestamp">
                {announcement.timestamp.toLocaleDateString()} -{" "}
                {announcement.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {labOwnerId === userId && (
                <button className="delete-ann-button" onClick={() => handleDeleteConfirmation(announcement.id)}>
                  Delete
                </button>
              )}
          </div>
        ))}
      </div>
    ) : (
      <p className="no-announcements-message">No announcements made yet</p>
    )}
  </div>
);
};

export default ViewAnnouncements;
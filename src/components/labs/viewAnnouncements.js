import React, { useEffect, useState } from 'react';
import '../../styles/labsnew.css';
import {useParams} from 'react-router';
import { collection, getDocs, orderBy, query, limit, getDoc, doc } from 'firebase/firestore'; 
import { db } from '../../firebase'; 


const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [labId, setLabId] = useState(''); // Add state for labId
  const { labId: urlLabId } = useParams(); 

  useEffect(() => {
    const getAnnouncements = async () => {
      // 1. Get labId if available (e.g., from URL params)

      if (urlLabId) {
        setLabId(urlLabId);
      }

      // 2. Fetch Announcements (Assuming you have the labId)
      if (labId) {
        const announcementsRef = collection(db, 'labs', labId, 'announcements');
        const q = query(announcementsRef, orderBy('timestamp', 'desc'), limit(10)); // Modify the limit value as needed

        const querySnapshot = await getDocs(q);
        const fetchedAnnouncements = querySnapshot.docs.map(async (doc) => { 
            const userData = await fetchUserData(doc.data().createdBy.id);
            return {
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
                createdBy: userData 
            };
        });

        // Wait for all userData promises to resolve
        const announcementsWithUserData = await Promise.all(fetchedAnnouncements);
        setAnnouncements(announcementsWithUserData); 
      }
    };

    getAnnouncements(); 
  }, [labId, urlLabId]); // Add dependencies

  async function fetchUserData(userId) {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return {
                id: userId,
                firstname: userSnap.data().firstName,
                lastname: userSnap.data().lastName, 
                // ...other fields to include 
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
        <div className="announcements-container">
            {announcements.length > 0 ? (
                announcements.map((announcement) => (
                    <div className="announcement-card" key={announcement.id}>
                        <h3>{announcement.title}</h3>
                        <p>{announcement.text}</p>
                        <div className="meta-info">
                            <p className="creator">Created by: {announcement.createdBy.firstname} {announcement.createdBy.lastname}</p>
                            <p className="timestamp"> 
                                {announcement.timestamp.toLocaleDateString()} - {announcement.timestamp.toLocaleTimeString()}
                            </p>
                        </div>                                           
                    </div>
                ))
            ) : (
                <p className="no-announcements-message">No announcements made yet</p> 
            )}
        </div>
    </div>
);
};

export default ViewAnnouncements;
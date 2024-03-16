
import { Link } from 'react-router-dom';
import '../styles/labsnew.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming your Firestore instance is in 'firebase.js'

const ViewLabMembers = () => {
    const [members, setMembers] = useState([]);
    const [labData, setLabData] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { labId } = useParams();

    const fetchLabMembersAndData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch members
            const membersRef = collection(db, 'labs', labId, 'members');
            const querySnapshot = await getDocs(membersRef);
            const memberIds = querySnapshot.docs.map(doc => doc.data().userId);
            const memberData = await Promise.all(memberIds.map(fetchUserData)); 
            setMembers(memberData);

            // Fetch lab data
            const labRef = doc(db, 'labs', labId); 
            const labSnap = await getDoc(labRef); 

            if (labSnap.exists()) {
                setLabData(labSnap.data()); 
            } else {
                setError('Lab not found');
            }

        } catch (error) {
            setError('Error fetching members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLabMembersAndData(); 
    }, [labId]); 

    async function fetchUserData(userId) {
        try {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return {
                    id: userId,
                    name: userSnap.data().firstName, 
                    // ...other fields you want to include 
                };
            } else {
                return {
                    id: userId,
                    name: 'Unknown User'
                };
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
            return {
                id: userId,
                name: 'Error Fetching User'
            };
        }
    }

  return (
    <div>
                {isLoading && <p>Loading members...</p>}
                {error && <p>Error: {error}</p>}
                {labData && members.length > 0 ? (
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>
                                {member.name} 
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p></p>
                )}

          </div>
      
  );
};

export default ViewLabMembers;
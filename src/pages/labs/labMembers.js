import '../../styles/labsnew.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming your Firestore instance is in 'firebase.js'
import { useOutletContext } from 'react-router-dom';

const LabMembers = () => {
    const [members, setMembers] = useState([]);
    const [labData, setLabData] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { labId } = useParams();
    const [currentPageName,setCurrentPageName] = useOutletContext();
    

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
                const memberDataWithOwner = memberData.map((member) => ({
                  ...member,
                  isOwner: member.id === labSnap.data().ownerID,
              }));
              if (memberDataWithOwner.some(member => member.isOwner)) { // Check if an owner exists
                console.log('Lab Owner Found:', memberDataWithOwner.find(member => member.isOwner)); 
            }
              setMembers(memberDataWithOwner);

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
        setCurrentPageName('Members'); 
    }, [labId, setCurrentPageName]); 

    async function fetchUserData(userId) {
        try {
            const userRef = doc(db, 'Users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return {
                    id: userId,
                    name: userSnap.data().firstName, 
                    pfPic: userSnap.data().pfpURL
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
        <div className="LabsMembers">
                {isLoading && <p>Loading members...</p>}
                {error && <p>Error: {error}</p>}

                {members.length > 0 ? (
                    <div className="members-list"> {/* Add a container */}
                        {members.map((member) => (
                             <div className={`member-card ${member.isOwner ? 'owner' : ''}`} 
                             key={member.id}>
                                <img 
                                  src={member.pfPic} // Get picture URL
                                  alt={member.name} 
                                  className="member-profile-picture"
                                />
                                <p className="member-name">{member.name}</p>
                                {member.isOwner && <p className="owner-label">Owner</p>}  
                            </div>
                        ))}
                    </div>
                ) : (
                    <p></p>
                )}
          </div>
      </div>
  );
};

export default LabMembers;
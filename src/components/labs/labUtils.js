import { deleteDoc, doc, updateDoc, arrayRemove , collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../../firebase'; 


export const DeleteLab = async (labId, navigate) => {
  if (window.confirm('Are you sure you want to delete this lab?')) {
      try {
          const labRef = doc(db, 'labs', labId);
          const membersRef = collection(labRef, 'members');

          // 1. Find members and update their 'myLabs' array
          const membersQuery = query(collection(db, 'labs',labId, 'members'));
          const membersSnapshot = await getDocs(membersQuery);

          await Promise.all(membersSnapshot.docs.map(async (memberDoc) => {
              const userId = memberDoc.data().userId;
              const userDocRef = doc(db, 'Users', userId);

              await updateDoc(userDocRef, {
                  myLabs: arrayRemove(labRef) 
              });
          }));

          await Promise.all(membersSnapshot.docs.map(memberDoc => deleteDoc(memberDoc.ref)));

          // 2. Delete the lab document
          await deleteDoc(labRef); 
          console.log('Lab deleted successfully!');

          navigate('/labs');
      } catch (error) {
          console.error("Error deleting lab:", error);
      }
  }
};


export const LeaveLab = async (labId, currentUserId, navigate) => {
    if (window.confirm('Are you sure you want to leave this lab?')) {
      try {
        const labRef = doc(db, 'labs', labId);
        const membersRef = collection(labRef, 'members');
  
        // 1. Find the current user's member document
        const currentUserMemberQuery = query(membersRef, where('userId', '==', currentUserId));
        const currentUserMemberSnapshot = await getDocs(currentUserMemberQuery);
  
        if (currentUserMemberSnapshot.empty) {
          console.error('Current user not found in lab members');
          return; 
        }
  
        const currentUserMemberDoc = currentUserMemberSnapshot.docs[0]; // Assuming only one matching member document
  
        // 2. Delete the current user's member document
        await deleteDoc(currentUserMemberDoc.ref);
  
        // 3. Remove the lab from the current user's 'myLabs' array
        const userDocRef = doc(db, 'Users', currentUserId);
        await updateDoc(userDocRef, {
          myLabs: arrayRemove(labRef) 
        });
  
        console.log('User removed from lab successfully!');
        navigate('/labs');
  
      } catch (error) {
        console.error("Error deleting user from lab:", error);
      }
    }
  };


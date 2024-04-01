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
          const membersRef = collection(db, 'labs', labId, 'members');

          // Check Membership
          const memberQuery = query(membersRef, where("userId", "==", currentUserId));
          const memberSnapshot = await getDocs(memberQuery);

          if (memberSnapshot.empty) {

              const userDocRef = doc(db, 'Users', currentUserId);
              await updateDoc(userDocRef, {
                  myLabs: arrayRemove(doc(db, 'labs', labId)) // Update to use doc()
              });
              console.log('Lab removed successfully');
              navigate('/labs');
          } else {
              // User is a member, perform the normal steps
              const currentUserMemberDoc = memberSnapshot.docs[0];
              await deleteDoc(currentUserMemberDoc.ref);

              const userDocRef = doc(db, 'Users', currentUserId);
              await updateDoc(userDocRef, {
                  myLabs: arrayRemove(doc(db, 'labs', labId)) // Update to use doc()
              });

              console.log('User removed from lab successfully!');
              navigate('/labs');
          }

      } catch (error) {
          console.error("Error deleting user from lab:", error);
      }
  }
};

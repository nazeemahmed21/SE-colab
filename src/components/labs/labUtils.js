import { deleteDoc, doc, updateDoc, arrayRemove , collection, getDocs, query } from 'firebase/firestore'; 
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

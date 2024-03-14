import {getDoc, doc} from 'firebase/firestore';
import {db} from './firebase';
import React from 'react';
// Loader Function (in a separate file or within your routes.js)
export async function labLoader({ params }) {
    const labRef = doc(db, 'labs', params.labId);
    const labSnap = await getDoc(labRef);

    if (labSnap.exists()) {
        return labSnap.data();
    } else {
        throw new Error('Lab not found'); 
    }
}
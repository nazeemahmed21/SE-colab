// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ0R15ggpAOPPNYXOIxJMeXzJxmwqx2Qc",
  authDomain: "final-colab.firebaseapp.com",
  projectId: "final-colab",
  storageBucket: "final-colab.appspot.com",
  messagingSenderId: "474778904282",
  appId: "1:474778904282:web:4e6913ee24a5b7f214a7e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
const db = getFirestore(app);

// export async function signup(email, password,firstName, lastName, gender, role) {
//   const auth = getAuth(); // Get the auth instance

//   try {
//     // Create the user with email and password
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//     // Extract the user's UID
//     const uid = userCredential.user.uid;

//     // Add a new document with user information to the "users" collection
//     const usersCollection = collection(db, "users"); // Assuming "db" is your Firestore instance
//     await addDoc(usersCollection, {
//       uid,
//       firstName,
//       lastName,
//       gender,
//       role,
//     });

//     // Return the user
//     return userCredential.user;
//   } catch (error) {
//     // Handle any errors here
//     throw error;
//   }
// }
// export function useAuth() {
//   const [currentUser, setCurrentUser] = useState();
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return unsub;
//   }, []);
//   return currentUser;
// }
export { storage, auth, db, getFirestore };

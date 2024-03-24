// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, addDoc, collection, query, where, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from 'react-router-dom';
// import firebase from "firebase/compat/app";
// import { auth } from "../firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBJ0R15ggpAOPPNYXOIxJMeXzJxmwqx2Qc",
  authDomain: "final-colab.firebaseapp.com",
  projectId: "final-colab",
  storageBucket: "final-colab.appspot.com",
  messagingSenderId: "474778904282",
  appId: "1:474778904282:web:4e6913ee24a5b7f214a7e3",
  measurementId: "G-5BE4YXX1SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const deleteSignedUser = async () => {
  // const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const userid = currentUser.uid;
  await deleteUser(currentUser);
  // await signOut(auth);
  // console.log('User signed out successfully');
  // navigate('/');

  console.log("success in deleting")
  localStorage.removeItem("user");
};

export { storage, auth, db, getFirestore, deleteSignedUser };

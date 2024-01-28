import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => {
      listen();
    };
  }, []);

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        setAuthUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {authUser ? (
        <>
          <p>{`signed in as ${authUser.email}`}</p>
          <button onClick={signOutUser}>Sign Out</button>
        </>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};

AuthDetails.getAuthUser = () => {
  return auth.currentUser;
};

export default AuthDetails;

import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useContext } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log(user)
        });

        // Clean up the listener when component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

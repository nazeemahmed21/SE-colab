import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                null,
                (error) => {
                    setErr(true);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        navigate('/');  
                    } catch (error) {
                        setErr(true);
                    }
                }
            );
        } catch (error) {
            setErr(true);
            console.error(error);
        }
    };
    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className='logo'>Chat Application</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit} className='form' action="">
                    <input type="text" placeholder='Display Name' />
                    <input type="text" placeholder='Email' />
                    <input type="password" placeholder='Password' />
                    <input style={{ display: "none" }} type="file" name="" id="file" />
                    <label htmlFor="file">
                        {/* <FcAddImage size={32} className='uploadIcon' /> */}
                        <span>Add an Avatar</span>
                    </label>
                    <button>Sign Up</button>
                    {err && <span className='err'>Something went wrong!</span>}
                    {console.log(err)}
                </form>
                <p>Do you Have an Account ?

                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
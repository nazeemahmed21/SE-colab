import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';


const Login = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');

        } catch (err) {
            console.log(err);
            setErr(true);
        }
    };

    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className='logo'>Chat Application</span>
                <span className='title'>Login</span>
                <form onSubmit={handleSubmit} className='form' action="">
                    <input type="text" placeholder='Email' />
                    <input type="password" placeholder='Password' />
                    <button >Sign In</button>
                    {err && <span className='err'>Something went wrong!</span>}

                </form>
                <p>Don't Have an Account ?
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;
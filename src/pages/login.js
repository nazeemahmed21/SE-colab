import React, { useRef } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/login.css'; // Adjust the CSS import path
import logo from '../images/logo.png'

function Login() {
  // const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the homepage upon successful login
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure here (e.g., show an error message)
    }
  };

  return (
    <div className='login-container'>
      <div className='l-form-container'>
        <h3>Enter your Email Address</h3>
        <input ref={emailRef} className='email' type='email' placeholder='Email...' />
        <h3>Enter your Password</h3>
        <input ref={passwordRef} className='password' type='password' placeholder='Password...' />
        <br></br>
        <button className='login_button' onClick={handleLogin}>Login</button>
        <br></br>
      </div>
      <div className='l-image-container'>
        <img src={logo} alt='logo' />
      </div>  
    </div>
  );
}

export default Login;

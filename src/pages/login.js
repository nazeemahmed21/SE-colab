import React, { useRef } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../styles/login.module.css"; // Adjust the CSS import path
import logo from "../images/logo.png";
import { fetchid } from "../components/firebaseforreminder";

function Login() {
  // const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate(); // Initialize useNavigate

  // const handleLogin = async () => {
  //   const email = emailRef.current.value;
  //   const password = passwordRef.current.value;

  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     // Redirect to the homepage upon successful login
  //     navigate('/home');
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     // Handle login failure here (e.g., show an error message)
  //   }
  // };
  const handleLogin = (e) => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then(
      (userCredentials) => {
        const user = userCredentials.user;
        console.log("hi");
        // Check if the user exists and their email is verified
        if (user && user.emailVerified) {
          navigate("/home");
        } else if (user && !user.emailVerified) {
          // setFail(true);
          // setErrMsg("Please verify your email before logging in.")
          console.log("Please verify your email before logging in.");
        }
      }
    );
    fetchid().catch((error) => {
      const errorMessage = `Error creating user: ${error}`;
      // setErrMsg(errorMessage);
      // setFail(true);
      console.log(errorMessage);
    });
  };
  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <h3>Enter your Email Address</h3>
        <input
          ref={emailRef}
          className="email"
          type="email"
          placeholder="Email..."
        />
        <h3>Enter your Password</h3>
        <input
          ref={passwordRef}
          className="password"
          type="password"
          placeholder="Password..."
        />
        <br></br>
        <span className={styles.login_no_underline}>
          Don't have an account?{" "}
        </span>
        <Link to="/signup" className={styles.link_to_signin}>
          Sign Up Now.
        </Link>
        <br></br>
        <button className={styles.login_button} onClick={handleLogin}>
          Login
        </button>
        <br></br>
      </div>
      <div className={styles.l_image_container}>
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
}

export default Login;

import React, { useRef, useState } from 'react';
import '../styles/signup.css'; // Adjust the CSS import path
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';


function Signup() {
  const navigate = useNavigate(); 
  const emailRef = useRef();
  const passwordRef = useRef();
  const [firstN, setFirstN] = useState("");
  const [secondN, setSecN] = useState("");
  const [sex, setSex] = useState("");
  const [job, setJob] = useState("");
  
  // const firstName = firstN// Get the first name value from your input
  // const lastName = secondN// Get the last name value from your input
  // const gender = sex// Get the gender value from your input
  // const role = job// Get the role value from your input
  // async function handleSignUp() {
  //   try {
  //     setLoading(true);
  //     await signup(email, password, firstName, lastName, gender, role);
  //     navigate("/profile-setup");
  //   } catch(error) {
  //     alert(error)
  //   }
  //   setLoading(false);
  // }
  const handleFNChange = (event) => {
    setFirstN(event.target.value);
  }
  const handleSNChange = (event) => {
    setSecN(event.target.value);
  }
  const handleGenderChange = (event) => {
    setSex(event.target.value); // Set the selected gender value
  }
  const handleRoleChange = (event) => {
    setJob(event.target.value); // Set the selected role value
  }
  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
  
    // Check if any of the required fields are empty
    if (firstN === '' || secondN === '' || sex === '' || job === '') {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Perform user registration only if all required fields are filled
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
  
        updateProfile(user, {
          displayName: firstN,
      });

        setDoc(doc(db, "Users", uid), {
          firstName: firstN,
          lastName: secondN,
          gender: sex,
          role: job,
          uid: uid,
          profileSetup: false
        });
  
        setDoc(doc(db,"userChats",uid),{});

        navigate("/profile-setup");
      })
      .catch((error) => {
        // Handle sign-up errors
        console.log("Error creating user:", error);
      });
  };
  // const handleSignUpWithEmail = async(e) => {
  //   e.preventDefault();
  //   const email = emailRef.current.value;
  //   const password = passwordRef.current.value;
  //   createUserWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //           const user = userCredential.user;
  //         // const v1 = USER_REGEX.test(username);
          
  //           // console.log('hola');
  //           const uid = user.uid;
  //           // const v2 = PWD_REGEX.test(pwd);
  //           // const v3 = EMAIL_REGEX.test(email);

  //           // if (!v1 || !v2 || !v3) {
  //           //     setErrMsg("Invalid Entry")
  //           //     return;
  //           // }
  //           // console.log(username, pwd);
  //           // setSuccess(true);

  //           // // Send email verification
  //           // sendEmailVerification(user)
  //           //     .then(() => {
  //           //         // Verification email sent successfully
  //           //         console.log("Verification email sent");
  //           //     })
  //           //     .catch((error) => {
  //           //         // Handle email verification error
  //           //         console.log("Error sending verification email:", error);
  //           //     });

  //           //     updateProfile(user, {
  //           //         displayName: username,
  //           //       });

  //           setDoc(doc(db, "Users", uid), {
  //             firstName: firstN,
  //             lastName: secondN,
  //             gender: sex,
  //             role: job,
  //             uid:uid,
  //             profileSetup: false
  //           })
           
  //           // setDoc(doc(db,"userChats",uid),{});
  //         navigate("/profile-setup");
  //       })
  //       .catch((error) => {
  //           // Handle sign-up errors
  //           console.log("Error creating user:", error);
  //       });
  return (
    
    <div className='signup-main-container'>
      <div className='signup-form-container'>
        <h1>Register</h1>
        <h3>Enter your First Name</h3>
        <input onChange={handleFNChange} className='signup-name1' type='text' placeholder='First Name...' />
        <h3>Enter your Second Name</h3>
        <input onChange={handleSNChange} className='signup-name2' type='text' placeholder='Second Name...' />
        <h3>Enter your Email Address</h3>
        <input ref={emailRef} className='signup-email' type='email' placeholder='Email...' />
        <h3>Enter your Password</h3>
        <input ref={passwordRef} className='signup-password' type='password' placeholder='Password...' />
        <h3>Select your gender</h3>
        <div className='signup-gender'>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleGenderChange} // Use the handleGenderChange function
            />
            <span>Male</span>
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleGenderChange} // Use the handleGenderChange function
            />
            <span>Female</span>
          </label>
        </div>
        <h3>Choose your role</h3>
        <div className='signup-role'>
          <select
            name="role-names"
            id="role-names"
            onChange={handleRoleChange} // Use the handleRoleChange function
          >
            <option value="default">Please choose a role</option>
            <option value="Student">Student</option>
            <option value="Educator">Educator</option>
            <option value="Marketer">Marketer</option>
            <option value="Artist">Artist</option>
          </select>
        </div>
        <Link to="/login" className='signup-link-to-login'>Already have an account? Login Now.</Link>
        <button className='signup_button' onClick={handleSignUpWithEmail} >Sign up</button>
      </div>
      <div className='signup-image-container'>
        <img src={logo} alt='logo' />
      </div>
      <div className='signup-text'>
      </div>
    </div>
  );
}

export default Signup;

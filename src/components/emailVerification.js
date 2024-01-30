import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function PostVerificationCheck() {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      auth.currentUser.reload().then(() => {
        if (auth.currentUser.emailVerified) {
          setIsVerified(true);
          clearInterval(intervalId);
          navigate('/profile-setup'); // or any other page you want to navigate to
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [navigate]);

  if (!isVerified) {
    return <div>Please verify your email. Check your inbox for the verification email.</div>;
  }

  return <div>Your email is verified!</div>;
}

export default PostVerificationCheck;

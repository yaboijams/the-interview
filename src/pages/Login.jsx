// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AuthForm from '../components/AuthForm';
import AuthContainer from '../components/AuthContainer';

function Login() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleToggleMode = () => {
    setMode((prevMode) => (prevMode === 'login' ? 'signup' : 'login'));
  };

  const handleAuthSubmit = async ({ email, password, firstName, lastName }) => {
    setError(null);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email: user.email,
          createdAt: new Date(),
        });

        navigate('/profile');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/profile');
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract user details
      const displayName = user.displayName || '';
      const [firstName, ...lastNameParts] = displayName.split(' ');
      const lastName = lastNameParts.join(' ');
      const profilePic = user.photoURL || '/default-avatar.jpg';

      // Check if user already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Save new Google user details to Firestore
        await setDoc(userRef, {
          firstName: firstName || 'GoogleUser',
          lastName: lastName || '',
          email: user.email,
          ProfilePic: profilePic, // Save profile picture URL
          createdAt: new Date(),
        });
      }

      navigate('/profile');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setError('No account found with this email. Please sign up first.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        setError('This email is already registered. Please log in.');
        break;
      case 'auth/weak-password':
        setError('Password should be at least 6 characters.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      default:
        setError('Something went wrong. Please try again later.');
        break;
    }
  };

  return (
    <AuthContainer>
      <AuthForm
        mode={mode}
        onToggleMode={handleToggleMode}
        onSubmit={handleAuthSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        error={error}
      />
      <div id="recaptcha-container"></div>
    </AuthContainer>
  );
}

export default Login;

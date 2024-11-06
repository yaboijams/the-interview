// src/pages/Login.js
import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import AuthForm from '../components/AuthForm';
import AuthContainer from '../components/AuthContainer';

function Login() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);

  const handleToggleMode = () => {
    setMode((prevMode) => (prevMode === 'login' ? 'signup' : 'login'));
  };

  const handleAuthSubmit = async ({ email, password, firstName, lastName }) => {
    setError(null);
    try {
      if (mode === 'signup') {
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user info (first name, last name) to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email: user.email,
          createdAt: new Date(),
        });
      } else {
        // Sign in if already registered
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthContainer>
      <AuthForm
        mode={mode}
        onToggleMode={handleToggleMode}
        onSubmit={handleAuthSubmit}
        onGoogleSignIn={handleGoogleSignIn}
      />
      <div id="recaptcha-container"></div>
    </AuthContainer>
  );
}

export default Login;

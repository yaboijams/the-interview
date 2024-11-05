// src/pages/Login.js
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import AuthContainer from '../components/AuthContainer';

function Login() {
  const [mode, setMode] = useState('login');

  const handleToggleMode = () => {
    setMode((prevMode) => (prevMode === 'login' ? 'signup' : 'login'));
  };

  const handleAuthSubmit = (formData) => {
    console.log('Form Submitted:', formData);
    // Add logic for authentication here (e.g., send data to Firebase)
  };

  return (
    <AuthContainer>
      <AuthForm mode={mode} onToggleMode={handleToggleMode} onSubmit={handleAuthSubmit} />
    </AuthContainer>
  );
}

export default Login;

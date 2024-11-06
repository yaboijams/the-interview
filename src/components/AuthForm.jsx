// src/components/AuthForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

function AuthForm({ mode, onToggleMode, onSubmit, onGoogleSignIn, onPhoneSignIn, onVerifyOtp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await onSubmit({ email, password, firstName, lastName });
      } else {
        await onSubmit({ email, password });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    try {
      await onPhoneSignIn(phoneNumber);
      setIsOtpSent(true);
    } catch (error) {
      setError('Failed to send OTP. Please check the phone number and try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await onVerifyOtp(otp);
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'background.paper',
        padding: '32px',
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        mx: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
        {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
      </Typography>

      {error && (
        <Box sx={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 2, borderRadius: 2 }}>
          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        </Box>
      )}

      {mode === 'signup' && (
        <>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </>
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {mode === 'signup' && (
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: 'primary.main',
          color: 'text.primary',
          padding: '12px 0',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : mode === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <DividerText text="or sign in with" />

      <Button
        variant="outlined"
        onClick={onGoogleSignIn}
        sx={{
          color: 'primary.main',
          borderColor: 'primary.main',
          padding: '10px 0',
          fontWeight: 500,
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.light',
          },
        }}
      >
        Sign In with Google
      </Button>

      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="outlined"
        onClick={handlePhoneSignIn}
        sx={{
          color: 'primary.main',
          borderColor: 'primary.main',
          padding: '10px 0',
          fontWeight: 500,
          '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'primary.light',
          },
        }}
      >
        Send OTP
      </Button>

      {isOtpSent && (
        <Box component="form" onSubmit={handleOtpSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              color: 'text.primary',
              padding: '12px 0',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Verify OTP
          </Button>
        </Box>
      )}

      <Button variant="text" onClick={onToggleMode} sx={{ mt: 2, color: 'primary.main', fontWeight: 500 }}>
        {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
      </Button>
    </Box>
  );
}

function DividerText({ text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
      <Typography variant="body2" sx={{ paddingX: 2, color: 'text.secondary' }}>
        {text}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: 'divider' }} />
    </Box>
  );
}

export default AuthForm;

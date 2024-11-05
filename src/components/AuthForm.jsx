// src/components/AuthForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function AuthForm({ mode, onToggleMode, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass form data back to the parent component for handling
    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onSubmit({ email, password });
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
        padding: '24px',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        width: '100%',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ backgroundColor: 'background.default' }}
      />

      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ backgroundColor: 'background.default' }}
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
          sx={{ backgroundColor: 'background.default' }}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: 'primary.main',
          color: 'text.primary',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <Button
        variant="text"
        onClick={onToggleMode}
        sx={{ textTransform: 'none', color: 'primary.main', mt: 2 }}
      >
        {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
      </Button>
    </Box>
  );
}

export default AuthForm;

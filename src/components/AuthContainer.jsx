// src/components/AuthContainer.js
import React from 'react';
import { Container, Box } from '@mui/material';

function AuthContainer({ children }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </Box>
    </Container>
  );
}

export default AuthContainer;

// src/components/FormContainer.js
import React from 'react';
import { Container, Box } from '@mui/material';

function FormContainer({ children }) {
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundColor: 'background.paper',
        padding: '32px',
        borderRadius: 2,
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        {children}
      </Box>
    </Container>
  );
}

export default FormContainer;

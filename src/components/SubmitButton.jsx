// src/components/SubmitButton.js
import React from 'react';
import { Button } from '@mui/material';

function SubmitButton({ disabled }) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={disabled}
      sx={{
        backgroundColor: 'primary.main',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
        mt: 2,
        fontWeight: 600,
      }}
    >
      Submit
    </Button>
  );
}

export default SubmitButton;

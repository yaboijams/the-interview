// src/components/AuthorInfo.js
import React from 'react';
import { Box, Avatar, Typography, useTheme } from '@mui/material';

function AuthorInfo() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      mb={4}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '16px',
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Avatar alt="Author Name" src="/path/to/avatar.jpg" sx={{ width: 64, height: 64, mr: 2 }} />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Author Name
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Brief bio or description of the author. This could include their role, expertise, or anything relevant.
        </Typography>
      </Box>
    </Box>
  );
}

export default AuthorInfo;

// src/components/UserInfo.js
import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';

function UserInfo({ name, bio, profilePicture, onEdit }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        mb: 4,
        gap: 3,
      }}
    >
      <Avatar
        alt={name}
        src={profilePicture}
        sx={{ width: 90, height: 90, border: '2px solid', borderColor: 'primary.main' }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
          {bio}
        </Typography>
      </Box>
      {onEdit && (
        <Button
          onClick={onEdit}
          variant="outlined"
          sx={{
            padding: '8px 16px',
            color: 'primary.main',
            borderColor: 'primary.main',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.dark',
            },
          }}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
}

export default UserInfo;

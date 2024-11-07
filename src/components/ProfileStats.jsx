import React from 'react';
import { Box, Typography } from '@mui/material';

function ProfileStats({ postCount, viewersCount, reactionsCount, commentsCount }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '16px',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        mb: 4,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {postCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Posts
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {viewersCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Viewers
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {reactionsCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reactions
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {commentsCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comments
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfileStats;

// src/components/AuthorInfo.js
import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, useTheme } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function AuthorInfo({ userId }) {
  const theme = useTheme();
  const [author, setAuthor] = useState({
    name: '',
    profilePicture: '',
    currentCompany: '',
    currentPosition: '',
    bio: '',
  });

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setAuthor({
              name: userData.name || 'Anonymous',
              profilePicture: userData.ProfilePic || '/default-avatar.jpg', // Use 'ProfilePic' field
              currentCompany: userData.currentCompany || '',
              currentPosition: userData.currentPosition || '',
              bio: userData.bio || '',
            });
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching author info:', error);
        }
      }
    };
    fetchAuthorInfo();
  }, [userId]);

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
      <Avatar
        alt={author.name}
        src={author.profilePicture}
        sx={{ width: 64, height: 64, mr: 2 }}
      />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {author.name}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
          {author.currentPosition && author.currentCompany
            ? `${author.currentPosition} at ${author.currentCompany}`
            : 'Position information unavailable'}
        </Typography>
        {author.bio && (
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
            {author.bio}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default AuthorInfo;

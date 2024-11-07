// src/components/UserInfo.js
import React, { useRef, useState } from 'react';
import { Box, Avatar, Typography, Button, CircularProgress } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function UserInfo({
  name = 'Test User',
  bio = 'This is a test bio for the user.',
  profilePicture = '/path/to/default-profile.jpg',
  currentPosition = 'Software Engineer',
  currentCompany = 'TechCorp',
  formerPosition = 'Intern',
  formerCompany = 'OldCompany',
  location = 'San Francisco, CA',
  onEdit
}) {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profilePicture);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading file:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setAvatarUrl(downloadURL);
          setUploading(false);

          // Update the user's profile picture in Firestore
          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { profilePicture: downloadURL });
          }
        }
      );
    }
  };

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
      <Box sx={{ position: 'relative' }}>
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 90,
            height: 90,
            border: '2px solid',
            borderColor: 'primary.main',
            cursor: 'pointer',
          }}
          onClick={handleAvatarClick}
        />
        {uploading && (
          <CircularProgress
            size={90}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              opacity: 0.7,
            }}
          />
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
          {bio}
        </Typography>

        {/* Current Position */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
            Current Position:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentPosition} at {currentCompany}
          </Typography>
        </Box>

        {/* Former Position */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
            Former Position:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formerPosition} at {formerCompany}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
            Location:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
        </Box>
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

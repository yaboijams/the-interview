import React, { useRef, useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  onEdit,
}) {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profilePicture);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Load the profile picture URL from Firestore on component mount
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.ProfilePic) {
            setAvatarUrl(userData.ProfilePic); // Set the URL from Firestore
          }
        }
      }
    };

    loadProfilePicture();
  }, [currentUser]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setError('');
      try {
        const token = await currentUser.getIdToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(process.env.REACT_APP_UPLOAD_IMAGE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        const downloadURL = data.downloadUrl;
        console.log("Image uploaded successfully, URL:", downloadURL);
        setAvatarUrl(downloadURL);
        setSuccess(true);

        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, { ProfilePic: downloadURL });
        }
      } catch (error) {
        setError('Error uploading file');
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
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
          src={avatarUrl || profilePicture}
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

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
            Current Position:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentPosition} at {currentCompany}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
            Former Position:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formerPosition} at {formerCompany}
          </Typography>
        </Box>

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

      {/* Snackbar for Success and Error Notifications */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Profile picture updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserInfo;

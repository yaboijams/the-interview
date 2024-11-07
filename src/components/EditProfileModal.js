// src/components/EditProfileModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function EditProfileModal({ open, onClose, currentUserData }) {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUserData.name || '');
  const [bio, setBio] = useState(currentUserData.bio || '');
  const [profilePicture, setProfilePicture] = useState(currentUserData.profilePicture || '');
  const [currentPosition, setCurrentPosition] = useState(currentUserData.currentPosition || '');
  const [currentCompany, setCurrentCompany] = useState(currentUserData.currentCompany || '');
  const [formerPosition, setFormerPosition] = useState(currentUserData.formerPosition || '');
  const [formerCompany, setFormerCompany] = useState(currentUserData.formerCompany || '');
  const [location, setLocation] = useState(currentUserData.location || '');

  const handleSave = async () => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name,
        bio,
        profilePicture,
        currentPosition,
        currentCompany,
        formerPosition,
        formerCompany,
        location,
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyles }}>
        <Typography variant="h6" gutterBottom>Edit Profile</Typography>

        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Bio"
          fullWidth
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Profile Picture URL"
          fullWidth
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Current Position"
          fullWidth
          value={currentPosition}
          onChange={(e) => setCurrentPosition(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Current Company"
          fullWidth
          value={currentCompany}
          onChange={(e) => setCurrentCompany(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Former Position"
          fullWidth
          value={formerPosition}
          onChange={(e) => setFormerPosition(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Former Company"
          fullWidth
          value={formerCompany}
          onChange={(e) => setFormerCompany(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={handleSave}>Save</Button>
      </Box>
    </Modal>
  );
}

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default EditProfileModal;

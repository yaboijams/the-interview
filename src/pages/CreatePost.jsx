// src/pages/CreatePost.js
import React, { useState } from 'react';
import { Typography, Snackbar, Box, Button } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import FormContainer from '../components/FormContainer';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const { currentUser } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    if (!currentUser) {
      setError('You must be logged in to create a post.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        ...formData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setOpenSnackbar(true);
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <FormContainer>
      {currentUser ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Create a New Post
          </Typography>
          <PostForm onSubmit={handleFormSubmit} />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            message="Post created successfully!"
          />
        </>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You need to be logged in to create a post.
          </Typography>
          <Button variant="contained" onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </Box>
      )}

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      )}
    </FormContainer>
  );
}

export default CreatePost;

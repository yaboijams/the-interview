// src/pages/CreatePost.js
import React from 'react';
import { Typography } from '@mui/material';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import FormContainer from '../components/FormContainer';
import PostForm from '../components/PostForm';
import { useAuth } from '../contexts/AuthContext'; // if you have AuthContext for user info
// Inside handleFormSubmit, add this after the post is successfully created
import { useState } from 'react';
import { Snackbar } from '@mui/material';

function CreatePost() {
  const { currentUser } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFormSubmit = async (formData) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'posts'), {
        ...formData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setOpenSnackbar(true); // Open Snackbar for success message
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <FormContainer>
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
    </FormContainer>
  );
}


export default CreatePost;

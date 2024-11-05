// src/pages/CreatePost.js
import React from 'react';
import { Typography } from '@mui/material';
import FormContainer from '../components/FormContainer';
import PostForm from '../components/PostForm';

function CreatePost() {
  const handleFormSubmit = (formData) => {
    // Logic to handle form submission (e.g., saving data to backend)
    console.log('Form submitted:', formData);
  };

  return (
    <FormContainer>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Create a New Post
      </Typography>
      <PostForm onSubmit={handleFormSubmit} />
    </FormContainer>
  );
}

export default CreatePost;

// src/pages/Home.js
import React from 'react';
import PostList from '../components/PostList';
import { Typography, Container } from '@mui/material';

function Home() {
  return (
    <Container sx={{ padding: '24px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome to The Interview Blog
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '24px' }}>
        Discover inspiring stories from individuals across different career paths.
      </Typography>
      <PostList />
    </Container>
  );
}

export default Home;

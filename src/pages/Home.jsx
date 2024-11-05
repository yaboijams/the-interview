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
      <PostList />
    </Container>
  );
}

export default Home;

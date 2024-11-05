// src/components/PostList.js
import React from 'react';
import PostCard from './PostCard';
import { Grid } from '@mui/material';

const samplePosts = [
  { id: 1, title: 'Breaking into Tech', description: 'How I landed my first tech job without a CS degree.' },
  { id: 2, title: 'Navigating Career Changes', description: 'A guide to switching fields and finding your passion.' },
  { id: 3, title: 'The Value of Networking', description: 'Why building connections is crucial in every career.' },
];

function PostList() {
  return (
    <Grid container spacing={4} justifyContent="center">
      {samplePosts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default PostList;

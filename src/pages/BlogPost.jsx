// src/pages/BlogPost.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Divider, Box, useTheme } from '@mui/material';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();

  return (
    <Container
      sx={{
        padding: '24px',
        maxWidth: '800px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary, // Ensure text color is set according to theme
        borderRadius: 2,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        my: 4,
      }}
    >
      {/* Blog Post Content */}
      <Box mb={4} sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          Blog Post Title
        </Typography>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          Published on January 1, 2023
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: theme.palette.divider }} />
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.75, color: theme.palette.text.primary }}>
          This is the main content of the blog post. Here, you can write the entire article text or any other content related to the post.
        </Typography>
      </Box>

      {/* Author Information */}
      <AuthorInfo />

      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />

      {/* Comments Section */}
      <CommentsSection postId={id} />
    </Container>
  );
}

export default BlogPost;

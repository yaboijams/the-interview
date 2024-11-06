// src/pages/BlogPost.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Divider, Box, CircularProgress, useTheme } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost(postSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!post) {
    return <Typography variant="h5" color="text.secondary" align="center" mt={4}>Post not found</Typography>;
  }

  return (
    <Container
      sx={{
        padding: '24px',
        maxWidth: '800px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        my: 4,
      }}
    >
      {/* Blog Post Content */}
      <Box mb={4} sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          Published on {post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date'}
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: theme.palette.divider }} />
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.75, color: theme.palette.text.primary }}>
          {post.content}
        </Typography>
      </Box>

      {/* Author Information */}
      <AuthorInfo userId={post.userId} />

      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />

      {/* Comments Section */}
      <CommentsSection postId={id} />
    </Container>
  );
}

export default BlogPost;

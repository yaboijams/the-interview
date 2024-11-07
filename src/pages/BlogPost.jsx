// src/pages/BlogPost.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Divider, Box, CircularProgress, IconButton, useTheme } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedByUser, setLikedByUser] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost(postData);
          setLikesCount(postData.likes?.length || 0);
          setLikedByUser(postData.likes?.includes(currentUser.uid));
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
  }, [id, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser) return;

    try {
      const postRef = doc(db, 'posts', id);
      if (likedByUser) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
        setLikedByUser(false);
        setLikesCount((prevCount) => prevCount - 1);
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
        setLikedByUser(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!post) {
    return <Typography variant="h5" color="text.secondary" align="center" mt={4}>Post not found</Typography>;
  }

  return (
    <Container
      sx={{
        padding: '32px',
        maxWidth: '800px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        my: 4,
      }}
    >
      {/* Blog Post Header */}
      <Box mb={4} sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          Published on {post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date'}
        </Typography>
      </Box>

      {/* Like Button with Animation */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <IconButton
          onClick={handleLikeToggle}
          color="primary"
          sx={{
            transform: likedByUser ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s ease, color 0.3s ease',
            color: likedByUser ? theme.palette.primary.main : theme.palette.action.disabled,
          }}
        >
          <ThumbUpIcon fontSize="normal" />
        </IconButton>
        <Typography variant="body1" sx={{ ml: 1, color: theme.palette.text.primary }}>
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </Typography>
      </Box>

      {/* Author Information */}
      <Box mb={6}>
        <AuthorInfo userId={post.userId} />
      </Box>

      {/* Introduction Section */}
      <Box mb={5}>
        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
          {post.description}
        </Typography>
      </Box>

      {/* Current Position Section */}
      <Box mb={5}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          My Role at {post.company}
        </Typography>
        <Typography variant="body1" paragraph>
          Currently, I’m working as a <b>{post.position}</b> at <b>{post.company}</b>. This position has allowed me to
          develop and apply a unique set of skills that I value highly.
        </Typography>
      </Box>

      {/* Application Process Section */}
      <Box mb={5}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          The Application Journey
        </Typography>
        <Typography variant="body1" paragraph>
          I found the job posting while {post.applicationProcess}. It was a rewarding, yet challenging process that
          tested my perseverance. I relied on skills like <b>{post.skills}</b>, which played a significant role in my
          success.
        </Typography>
      </Box>

      {/* Interview Process Section */}
      <Box mb={5}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Interview Insights and Challenges
        </Typography>
        <Typography variant="body1" paragraph>
          The interview format was {post.interviewFormat}. Going through this process presented a few hurdles,
          especially when {post.challenges}. However, each challenge provided a new perspective and learning
          opportunity.
        </Typography>
      </Box>

      {/* Salary Insights Section */}
      {post.salaryInsights && (
        <Box mb={5}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Salary and Benefits Insights
          </Typography>
          <Typography variant="body1" paragraph>
            {post.salaryInsights}
          </Typography>
        </Box>
      )}

      {/* Reflections and Future Goals Section */}
      <Box mb={5}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Reflections and Aspirations
        </Typography>
        <Typography variant="body1" paragraph>
          Reflecting on this journey, I’ve learned that {post.reflections}. Moving forward, my goal is to {post.futureGoals}.
          This role has been a stepping stone towards what I envision for my future career.
        </Typography>
      </Box>

      {/* Advice Section */}
      <Box mb={5}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          My Advice for Aspiring Professionals
        </Typography>
        <Typography variant="body1" paragraph>
          {post.advice}
        </Typography>
      </Box>

      {/* Divider and Comments Section */}
      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />
      <CommentsSection postId={id} />
    </Container>
  );
}

export default BlogPost;

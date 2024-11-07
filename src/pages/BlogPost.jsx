// src/pages/BlogPost.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Divider, Box, CircularProgress, IconButton, Menu, MenuItem, useTheme, Chip } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState({});

  const reactionOptions = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data();
          setPost(postData);
          setReactionsCount(postData.reactions || {});
          setUserReaction(postData.userReactions?.[currentUser?.uid] || null);
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

  const handleReactionClick = (event) => {
    setReactionAnchor(event.currentTarget);
  };

  const handleReactionSelect = async (reaction) => {
    if (!currentUser) return;

    const postRef = doc(db, 'posts', id);
    const previousReaction = userReaction;

    const newReactionsCount = { ...reactionsCount };
    if (previousReaction) {
      newReactionsCount[previousReaction] = (newReactionsCount[previousReaction] || 1) - 1;
    }
    newReactionsCount[reaction] = (newReactionsCount[reaction] || 0) + 1;

    try {
      await updateDoc(postRef, {
        reactions: newReactionsCount,
        [`userReactions.${currentUser.uid}`]: reaction,
      });
      setReactionsCount(newReactionsCount);
      setUserReaction(reaction);
    } catch (error) {
      console.error('Error updating reactions:', error);
    } finally {
      setReactionAnchor(null);
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
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        my: 4,
      }}
    >
      {/* Blog Post Header with Gradient Background */}
      <Box
        mb={4}
        sx={{
          textAlign: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          color: theme.palette.primary.contrastText,
          borderRadius: 2,
          padding: '16px 24px',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {post.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
          Published on {post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date'}
        </Typography>
      </Box>

      {/* Reaction Button and Counts */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <IconButton
          onClick={handleReactionClick}
          color="primary"
          sx={{
            color: userReaction ? theme.palette.primary.main : theme.palette.action.disabled,
            backgroundColor: userReaction ? theme.palette.background.default : 'transparent',
            boxShadow: userReaction ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <EmojiEmotionsIcon fontSize="large" />
        </IconButton>
        <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
          {Object.entries(reactionsCount).map(([emoji, count]) => (
            <Chip
              key={emoji}
              label={`${emoji} ${count}`}
              sx={{
                fontSize: '1rem',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Reaction Menu */}
      <Menu
        anchorEl={reactionAnchor}
        open={Boolean(reactionAnchor)}
        onClose={() => setReactionAnchor(null)}
        sx={{ '& .MuiMenu-paper': { borderRadius: 2 } }}
      >
        {reactionOptions.map((emoji) => (
          <MenuItem
            key={emoji}
            onClick={() => handleReactionSelect(emoji)}
            sx={{
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            {emoji}
          </MenuItem>
        ))}
      </Menu>

      {/* Author Information */}
      <Box mb={6}>
        <AuthorInfo userId={post.userId} />
      </Box>

      {/* Introduction Section */}
      <Box mb={5} sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, paddingLeft: 2 }}>
        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
          {post.description}
        </Typography>
      </Box>

      {/* Sections */}
      {[{ label: "My Role at", content: post.position, company: post.company },
        { label: "The Application Journey", content: post.applicationProcess, skills: post.skills },
        { label: "Interview Insights and Challenges", content: post.interviewFormat, challenges: post.challenges },
        { label: "Salary and Benefits Insights", content: post.salaryInsights },
        { label: "Reflections and Aspirations", content: post.reflections, goals: post.futureGoals },
        { label: "My Advice for Aspiring Professionals", content: post.advice }]
        .map((section, index) => (
          <Box key={index} mb={5} sx={{ backgroundColor: theme.palette.background.default, padding: 2, borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {section.label} {section.company || ""}
            </Typography>
            <Typography variant="body1" paragraph>
              {section.content}
            </Typography>
            {section.skills && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Skills: {section.skills}</Typography>}
            {section.challenges && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Challenges: {section.challenges}</Typography>}
            {section.goals && <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Goals: {section.goals}</Typography>}
          </Box>
        ))}

      {/* Divider */}
      <Divider sx={{ my: 4, backgroundColor: theme.palette.divider }} />

      {/* Comments Section */}
      <CommentsSection postId={id} />
    </Container>
  );
}

export default BlogPost;

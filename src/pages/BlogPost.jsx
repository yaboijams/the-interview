import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Divider, Box, CircularProgress, IconButton, Menu, MenuItem, useTheme, Chip, Stack, Tooltip } from '@mui/material';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import CommentsSection from '../components/CommentsSection';
import AuthorInfo from '../components/AuthorInfo';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VisibilityIcon from '@mui/icons-material/Visibility';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState({});
  const [viewersCount, setViewersCount] = useState(0);

  const reactionOptions = ['👍', '❤️', '😮', '😢', '👏'];

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
          setViewersCount(postData.viewers?.length || 0);

          if (currentUser && !postData.viewers?.includes(currentUser.uid)) {
            await updateDoc(postRef, {
              viewers: arrayUnion(currentUser.uid),
            });
            setViewersCount((prevCount) => prevCount + 1);
          }
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
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    color: theme.palette.grey[100], // Lighter text color for better contrast
    borderRadius: 2,
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  }}
>
  <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
    {post.title}
  </Typography>
  <Typography variant="subtitle2" sx={{ opacity: 0.85, color: theme.palette.grey[200] }}>
    Published on {post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date'}
  </Typography>

{/* Description under title */}
<Box mt={2} sx={{ padding: '0 10%', color: theme.palette.grey[300] }}>
  <Typography variant="h6" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
    {post.description}
  </Typography>
</Box>


 {/* Viewers Icon */}
<Tooltip title={`${viewersCount} Views`} placement="top">
  <IconButton
    sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.primary, // Adapt color for theme
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], // Adapt background for theme
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      },
      borderRadius: '50%', // Circular shape
      padding: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
    }}
  >
    <VisibilityIcon />
    <Typography
      variant="body2"
      sx={{
        ml: 0.5,
        fontWeight: 500,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.primary, // Adapt text color for theme
      }}
    >
      {viewersCount}
    </Typography>
  </IconButton>
</Tooltip>

</Box>


      {/* Reaction Button and Counts */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4} flexWrap="wrap" sx={{ gap: 1 }}>
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
        <Stack direction="row" spacing={1} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
        </Stack>
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

      {/* Sections */}
      {[
        { label: "My Role at", content: post.position, company: post.company },
        { label: "The Application Journey", content: post.applicationProcess, skills: post.skills },
        { label: "Interview Insights and Challenges", content: post.interviewFormat, challenges: post.challenges },
        { label: "Salary and Benefits Insights", content: post.salaryInsights },
        { label: "Reflections and Aspirations", content: post.reflections, goals: post.futureGoals },
        { label: "My Advice for Aspiring Professionals", content: post.advice },
      ].map((section, index) => (
        <Box
          key={index}
          mb={5}
          sx={{
            backgroundColor: theme.palette.background.default,
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderLeft: `5px solid ${theme.palette.primary.light}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {section.label} {section.company || ""}
          </Typography>
          <Typography variant="body1" paragraph>
            {section.content}
          </Typography>
          {section.skills && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Skills:</strong> {section.skills}
            </Typography>
          )}
          {section.challenges && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Challenges:</strong> {section.challenges}
            </Typography>
          )}
          {section.goals && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              <strong>Goals:</strong> {section.goals}
            </Typography>
          )}
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

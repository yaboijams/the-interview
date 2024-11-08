// src/components/PostCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, IconButton, Divider, Avatar, CardMedia, Paper, useTheme } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function PostCard({ post }) {
  const theme = useTheme();
  const [commentsCount, setCommentsCount] = useState(0);
  const [profilePic, setProfilePic] = useState('/default-avatar.jpg'); // Default avatar image
  const [authorName, setAuthorName] = useState('Unknown Author');
  const [currentPosition, setCurrentPosition] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');

  // Fetch profile picture, name, position, and company for the author using userId
  useEffect(() => {
    const fetchAuthorInfo = async () => {
      if (post.userId) {
        try {
          const userRef = doc(db, 'users', post.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setProfilePic(userData.ProfilePic || '/default-avatar.jpg'); // Use ProfilePic field if available
            setAuthorName(userData.name || 'Unknown Author'); // Use name field if available
            setCurrentPosition(userData.currentPosition || ''); // Use currentPosition if available
            setCurrentCompany(userData.currentCompany || ''); // Use currentCompany if available
          }
        } catch (error) {
          console.error('Error fetching author information:', error);
        }
      }
    };

    fetchAuthorInfo();
  }, [post.userId]);

  // Fetch the count of comments from the comments subcollection
  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const commentsSnapshot = await getDocs(collection(db, 'posts', post.id, 'comments'));
        setCommentsCount(commentsSnapshot.size);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };
    
    fetchCommentsCount();
  }, [post.id]);

  const getTotalReactions = (reactions) => {
    return reactions ? Object.values(reactions).reduce((acc, count) => acc + count, 0) : 0;
  };

  const getTotalViewers = (viewers) => (viewers ? viewers.length : 0);

  return (
    <Card
      sx={{
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 8px 24px rgba(0, 0, 0, 0.12)',
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(255, 255, 255, 0.15)' : '0 12px 32px rgba(0, 0, 0, 0.15)',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Post Image */}
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="160"
          image={post.imageUrl}
          alt={post.title}
          sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
        />
      )}

      <CardContent>
        {/* Author Information */}
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f9f9f9',
            boxShadow: theme.palette.mode === 'dark' ? '0 2px 6px rgba(255, 255, 255, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Avatar src={profilePic} alt={authorName} sx={{ width: 48, height: 48, mr: 2, border: '2px solid', borderColor: theme.palette.primary.main }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {authorName}
            </Typography>
            {currentPosition && currentCompany && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                {currentPosition} at {currentCompany}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Post Title */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
          {post.title}
        </Typography>

        {/* Category */}
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 1, display: 'block' }}>
          Category: {post.category || 'General'}
        </Typography>

        {/* Company and Position */}
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          <b>{post.company}</b> - {post.position}
        </Typography>

        {/* Post Date */}
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          Posted on {post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date'}
        </Typography>

        {/* Divider */}
        <Divider sx={{ my: 1, backgroundColor: theme.palette.divider }} />

        {/* Post Description */}
        <Typography variant="body2" color={theme.palette.text.secondary} sx={{ lineHeight: 1.6, mb: 2 }}>
          {post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
        <Button
          component={Link}
          to={`/post/${post.id}`}
          size="small"
          sx={{
            textDecoration: 'underline',
            color: theme.palette.primary.main,
            fontWeight: 600,
            '&:hover': {
              color: theme.palette.primary.dark,
            },
          }}
        >
          Read More
        </Button>
        <Box display="flex" alignItems="center" gap={1}>
          <Box display="flex" alignItems="center">
            <IconButton color="primary" disabled>
              <EmojiEmotionsIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {getTotalReactions(post.reactions)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton color="primary" disabled>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {commentsCount}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton color="primary" disabled>
              <VisibilityIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {getTotalViewers(post.viewers)}
            </Typography>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
}

export default PostCard;

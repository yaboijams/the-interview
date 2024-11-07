import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, List, ListItem, Paper, Avatar, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, Timestamp, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function CommentsSection({ postId, postAuthorId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('Anonymous');
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setDisplayName(userDoc.data().name || 'Anonymous');
        }
      }
    };
    fetchDisplayName();
  }, [currentUser]);

  useEffect(() => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);

      // Track the user's reactions
      const reactions = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        if (data.userReactions && data.userReactions[currentUser.uid]) {
          acc[doc.id] = data.userReactions[currentUser.uid];
        }
        return acc;
      }, {});
      setUserReactions(reactions);
    });
    return unsubscribe;
  }, [postId, currentUser]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    const commentData = {
      author: displayName,
      authorId: currentUser.uid,
      text: newComment,
      createdAt: Timestamp.now(),
      emojiReactions: {}, // Count for each reaction type
      userReactions: {},  // Tracks the user's current reaction
    };

    try {
      setLoading(true);
      const commentsRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsRef, commentData);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEmojiClick = (event, commentId) => {
    setEmojiAnchor({ anchor: event.currentTarget, commentId });
  };

  const handleEmojiSelect = async (emoji) => {
    if (!emojiAnchor || !currentUser) return;
    const { commentId } = emojiAnchor;
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const previousReaction = userReactions[commentId];

    try {
      // Update emoji counts based on user selection
      await updateDoc(commentRef, {
        [`emojiReactions.${emoji}`]: (comments.find((c) => c.id === commentId).emojiReactions[emoji] || 0) + 1,
        ...(previousReaction ? { [`emojiReactions.${previousReaction}`]: (comments.find((c) => c.id === commentId).emojiReactions[previousReaction] || 0) - 1 } : {}),
        [`userReactions.${currentUser.uid}`]: emoji,
      });
      setUserReactions((prevReactions) => ({
        ...prevReactions,
        [commentId]: emoji,
      }));
    } catch (error) {
      console.error('Error updating emoji reaction:', error);
    } finally {
      setEmojiAnchor(null);
    }
  };

  const handleReply = (comment) => {
    setNewComment(`@${comment.author}: `);
  };

  const emojiOptions = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} disablePadding sx={{ alignItems: 'flex-start', mb: 2 }}>
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                padding: '16px',
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {comment.author.charAt(0).toUpperCase()}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {comment.author}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                  {comment.text}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {emojiOptions.map((emoji) => (
                    <Typography key={emoji} variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {emoji} {(comment.emojiReactions && comment.emojiReactions[emoji]) || 0}
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Box>
                <IconButton onClick={(e) => handleEmojiClick(e, comment.id)}>
                  <EmojiEmotionsIcon fontSize="small" />
                </IconButton>
                {currentUser && comment.authorId === currentUser.uid && (
                  <IconButton onClick={() => handleDeleteComment(comment.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
                {currentUser && currentUser.uid === postAuthorId && (
                  <IconButton onClick={() => handleReply(comment)}>
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
      <TextField
        label="Add a comment"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{
          my: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleAddComment}
        disabled={!newComment.trim() || loading}
        sx={{
          width: '100%',
          py: 1.5,
          fontWeight: 600,
          fontSize: '1rem',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.background.paper,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      {/* Emoji Menu */}
      <Menu
        anchorEl={emojiAnchor ? emojiAnchor.anchor : null}
        open={Boolean(emojiAnchor)}
        onClose={() => setEmojiAnchor(null)}
      >
        {emojiOptions.map((emoji) => (
          <MenuItem key={emoji} onClick={() => handleEmojiSelect(emoji)}>
            {emoji}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default CommentsSection;

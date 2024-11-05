// src/components/CommentsSection.js
import React, { useState } from 'react';
import { Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, useTheme } from '@mui/material';

const sampleComments = [
  { id: 1, author: 'John Doe', text: 'Great article!' },
  { id: 2, author: 'Jane Smith', text: 'Thanks for sharing your insights.' },
];

function CommentsSection({ postId }) {
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState('');
  const theme = useTheme();

  const handleAddComment = () => {
    const newCommentObj = {
      id: comments.length + 1,
      author: 'Current User', // Replace with the logged-in user's name
      text: newComment,
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} disablePadding>
            <Paper
              elevation={1}
              sx={{
                width: '100%',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {comment.author}
                  </Typography>
                }
                secondary={<Typography sx={{ color: theme.palette.text.secondary }}>{comment.text}</Typography>}
              />
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
        sx={{ my: 2, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
      />
      <Button
        variant="contained"
        onClick={handleAddComment}
        disabled={!newComment}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default CommentsSection;

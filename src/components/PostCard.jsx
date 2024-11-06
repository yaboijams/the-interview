// src/components/PostCard.js
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Card
      sx={{
        boxShadow: 4,
        borderRadius: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>
          {post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component={Link}
          to={`/post/${post.id}`} // Link to the dynamic post ID route
          size="small"
          sx={{
            textDecoration: 'underline',
            color: 'primary.main',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;

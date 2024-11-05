// src/components/PostCard.js
import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Card sx={{ maxWidth: 345, margin: '16px auto', borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)' }, }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {post.description}
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

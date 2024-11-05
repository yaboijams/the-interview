// src/components/UserPosts.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

function UserPosts({ posts }) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        padding: '24px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Your Posts
      </Typography>
      <List>
        {posts.length > 0 ? (
          posts.map((post) => (
            <React.Fragment key={post.id}>
              <ListItem
                button
                component="a"
                href={`/post/${post.id}`}
                sx={{
                  '&:hover': {
                    backgroundColor: 'background.default',
                  },
                  paddingY: 1.5,
                }}
              >
                <ListItemText
                  primary={post.title}
                  secondary={post.date}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                  secondaryTypographyProps={{
                    color: 'text.secondary',
                    sx: { fontSize: '0.85rem' },
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You haven’t created any posts yet.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default UserPosts;

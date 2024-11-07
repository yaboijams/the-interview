import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import EditPostModal from './EditPostModal.js';

function UserPosts({ posts = [], onEditPost, onDeletePost }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    const fetchCommentsCount = async () => {
      const counts = {};
      for (const post of posts) {
        const commentsRef = collection(db, 'posts', post.id, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        counts[post.id] = commentsSnapshot.size;
      }
      setCommentsCount(counts);
    };

    fetchCommentsCount();
  }, [posts]);

  const handleOpenEditModal = (postId) => {
    setCurrentPostId(postId);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentPostId(null);
  };

  const handleSavePost = (postId, updatedPostDetails) => {
    onEditPost(postId, updatedPostDetails);
  };

  const getTotalReactions = (reactions) => {
    return reactions ? Object.values(reactions).reduce((acc, count) => acc + count, 0) : 0;
  };

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
                sx={{
                  paddingY: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'background.default',
                  },
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={
                      <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {post.title}
                      </Link>
                    }
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
                  <Box>
                    <IconButton onClick={() => handleOpenEditModal(post.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeletePost(post.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Post Stats */}
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <EmojiEmotionsIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{getTotalReactions(post.reactions)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{post.viewers?.length || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{commentsCount[post.id] || 0}</Typography>
                  </Box>
                </Box>
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

      {/* Edit Post Modal */}
      <EditPostModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        postId={currentPostId}
        onSave={handleSavePost}
      />
    </Box>
  );
}

export default UserPosts;

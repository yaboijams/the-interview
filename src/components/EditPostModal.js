import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function EditPostModal({ open, onClose, postId, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (postId) {
        setLoading(true);
        try {
          const postRef = doc(db, 'posts', postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = postSnap.data();
            setTitle(postData.title || '');
            setDescription(postData.description || '');
            setCategory(postData.category || '');
          }
        } catch (error) {
          console.error('Error fetching post data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (open) fetchPostDetails();
  }, [postId, open]);

  const handleSave = async () => {
    if (!postId) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { title, description, category });
      onSave(postId, { title, description, category });
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-post-title">
      <Box sx={modalStyles}>
        <Typography id="edit-post-title" variant="h6" gutterBottom>Edit Post</Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter post title"
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter post description"
            />
            
            <TextField
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter post category"
            />
            
            <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
              Save
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default EditPostModal;

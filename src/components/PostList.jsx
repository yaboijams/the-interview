// src/components/PostList.js
import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { Grid, CircularProgress, Box, Select, MenuItem, Typography, FormControl, InputLabel } from '@mui/material';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

const categories = ['General', 'Tech', 'Finance', 'Healthcare', 'Business', 'Government', 'Education', 'Creative', 'Freelance', 'Other'];

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('General');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const postsWithAuthors = await Promise.all(
          querySnapshot.docs.map(async (postDoc) => {
            const postData = postDoc.data();
            const authorRef = doc(db, 'users', postData.userId);
            const authorSnap = await getDoc(authorRef);

            return {
              id: postDoc.id,
              ...postData,
              author: authorSnap.exists()
                ? {
                    name: authorSnap.data().name || 'Anonymous',
                    profilePicture: authorSnap.data().profilePicture || '/default-avatar.jpg',
                    currentCompany: authorSnap.data().currentCompany,
                    currentPosition: authorSnap.data().currentPosition,
                  }
                : {
                    name: 'Anonymous',
                    profilePicture: '/default-avatar.jpg',
                  },
            };
          })
        );

        setPosts(postsWithAuthors);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    selectedCategory === 'General' || post.category === selectedCategory
  );

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <Box>
      {/* Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange} label="Filter by Category">
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Post List */}
      <Grid container spacing={4} justifyContent="center">
        {filteredPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>

      {filteredPosts.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" mt={4}>
          No posts found for this category.
        </Typography>
      )}
    </Box>
  );
}

export default PostList;

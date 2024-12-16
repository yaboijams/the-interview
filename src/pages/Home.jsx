// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import PostList from '../components/PostList';
import { Typography, Container, Box, Button, Grid, CircularProgress, Card, CardContent } from '@mui/material';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Home() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      setLoadingFeatured(true);
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        const post = querySnapshot.docs[0]?.data();
        if (post) setFeaturedPost({ id: querySnapshot.docs[0].id, ...post });
      } catch (error) {
        console.error('Error fetching featured post:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedPost();
  }, []);

  return (
    <Container sx={{ padding: '24px', textAlign: 'center' }}>
      {/* Header Section */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Welcome to The Interview Blog
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '24px' }}>
        Discover inspiring stories from individuals across different career paths.
      </Typography>

      {/* Featured Post */}
      {loadingFeatured ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 4 }} />
      ) : featuredPost && (
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'primary.light',
            color: 'white',
            padding: 3,
            mb: 4,
            boxShadow: 6,
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Featured Post
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {featuredPost.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
              {featuredPost.description.length > 150
                ? `${featuredPost.description.slice(0, 150)}...`
                : featuredPost.description}
            </Typography>
            <Button
              component={Link}
              to={`/post/${featuredPost.id}`}
              variant="contained"
              color="secondary"
              sx={{
                color: 'white',
                fontWeight: 600,
                mt: 1,
                '&:hover': { backgroundColor: 'secondary.dark' },
              }}
            >
              Read More
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Categories Section */}
      {/* <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Explore Categories
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['Tech', 'Finance', 'Healthcare', 'Business', 'Education', 'Creative', 'Freelance', 'Other'].map((category) => (
            <Grid item key={category}>
              <Button
                variant="outlined"
                sx={{
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                }}
              >
                {category}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      {/* About Section */}
      <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          About Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The Interview Blog is a platform where professionals share their career journeys, insights, and advice to
          inspire and guide others. Our mission is to provide real-world perspectives on various career paths.
        </Typography>
      </Box>

      {/* Post List */}
      <PostList />

      {/* Subscribe CTA */}
      {/* <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Stay Updated
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Subscribe to get the latest stories directly in your inbox!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            color: 'white',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Subscribe Now
        </Button>
      </Box> */}
    </Container>
  );
}

export default Home;

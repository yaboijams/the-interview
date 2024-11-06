// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';
import ProfileStats from '../components/ProfileStats';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Test User',
    bio: 'This is a test bio for the profile page.',
    profilePicture: '/path/to/default-profile.jpg',
  });
  const [posts, setPosts] = useState([
    { id: 1, title: 'Test Post 1', date: 'January 1, 2023' },
    { id: 2, title: 'Test Post 2', date: 'February 10, 2023' },
  ]);
  const [stats, setStats] = useState({ postCount: 2, readersCount: 20, likesCount: 10, commentsCount: 5 });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('userId', '==', currentUser.uid));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);

        setStats({
          postCount: userPosts.length,
          readersCount: userPosts.length * 10,
          likesCount: userPosts.length * 5,
          commentsCount: userPosts.length * 2,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        User Profile
      </Typography>
      <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{
          mb: 4,
          color: 'primary.main',
          borderColor: 'primary.main',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'primary.light',
            borderColor: 'primary.dark',
          },
        }}
      >
        Log Out
      </Button>
      <UserInfo
        name={user.name}
        bio={user.bio}
        profilePicture={user.profilePicture}
        onEdit={handleEditProfile}
      />
      <ProfileStats
        postCount={stats.postCount}
        readersCount={stats.readersCount}
        likesCount={stats.likesCount}
        commentsCount={stats.commentsCount}
      />
      <UserPosts posts={posts} />
    </Container>
  );
}

export default Profile;

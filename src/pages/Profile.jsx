// src/pages/Profile.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';
import ProfileStats from '../components/ProfileStats';

function Profile() {
  const mockUser = {
    name: 'Jane Doe',
    bio: 'Software Engineer passionate about building impactful applications.',
    profilePicture: '/path/to/profile.jpg',
  };

  const mockPosts = [
    { id: 1, title: 'My Journey into Tech', date: 'January 10, 2023' },
    { id: 2, title: 'How I Got My First Job', date: 'February 5, 2023' },
  ];

  const handleEditProfile = () => {
    // Logic for editing profile can be added here
    console.log('Edit profile clicked');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        User Profile
      </Typography>
      <UserInfo
        name={mockUser.name}
        bio={mockUser.bio}
        profilePicture={mockUser.profilePicture}
        onEdit={handleEditProfile}
      />
      <ProfileStats postCount={mockPosts.length} />
      <UserPosts posts={mockPosts} />
    </Container>
  );
}

export default Profile;

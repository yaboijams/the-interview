// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
    currentPosition: '',
    currentCompany: '',
    formerPosition: '',
    formerCompany: '',
    location: '',
  });
  const [posts, setPosts] = useState([
    { id: 1, title: 'Test Post 1', date: 'January 1, 2023' },
    { id: 2, title: 'Test Post 2', date: 'February 10, 2023' },
  ]);
  const [stats, setStats] = useState({ postCount: 2, readersCount: 20, likesCount: 10, commentsCount: 5 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    currentPosition: '',
    currentCompany: '',
    formerPosition: '',
    formerCompany: '',
    location: '',
  });

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
          const userData = userSnap.data();
          setUser(userData);
          setEditFormData({
            name: userData.name,
            bio: userData.bio,
            currentPosition: userData.currentPosition,
            currentCompany: userData.currentCompany,
            formerPosition: userData.formerPosition,
            formerCompany: userData.formerCompany,
            location: userData.location,
          });
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
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: editFormData.name,
        bio: editFormData.bio,
        currentPosition: editFormData.currentPosition,
        currentCompany: editFormData.currentCompany,
        formerPosition: editFormData.formerPosition,
        formerCompany: editFormData.formerCompany,
        location: editFormData.location,
      });
      setUser((prevUser) => ({ ...prevUser, ...editFormData }));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
        currentPosition={user.currentPosition}
        currentCompany={user.currentCompany}
        formerPosition={user.formerPosition}
        formerCompany={user.formerCompany}
        location={user.location}
        onEdit={handleEditProfile}
      />
      <ProfileStats
        postCount={stats.postCount}
        readersCount={stats.readersCount}
        likesCount={stats.likesCount}
        commentsCount={stats.commentsCount}
      />
      <UserPosts posts={posts} />

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            name="bio"
            value={editFormData.bio}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Current Position"
            fullWidth
            name="currentPosition"
            value={editFormData.currentPosition}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Current Company"
            fullWidth
            name="currentCompany"
            value={editFormData.currentCompany}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Former Position"
            fullWidth
            name="formerPosition"
            value={editFormData.formerPosition}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Former Company"
            fullWidth
            name="formerCompany"
            value={editFormData.formerCompany}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            name="location"
            value={editFormData.location}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;

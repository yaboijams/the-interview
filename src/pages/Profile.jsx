// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';
import ProfileStats from '../components/ProfileStats';
import EditPostModal from '../components/EditPostModal.js';

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
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ postCount: 0, viewersCount: 0, reactionsCount: 0, commentsCount: 0 });
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
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostData, setSelectedPostData] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        // Fetch user information
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

        // Fetch posts by the user
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('userId', '==', currentUser.uid));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);

        // Calculate stats
        let viewersCount = 0;
        let reactionsCount = 0;
        let commentsCount = 0;

        for (const post of userPosts) {
          // Sum viewers
          viewersCount += post.viewers?.length || 0;

          // Sum reactions
          reactionsCount += post.reactions ? Object.values(post.reactions).reduce((acc, count) => acc + count, 0) : 0;

          // Fetch and count comments for each post
          const commentsRef = collection(db, 'posts', post.id, 'comments');
          const commentsSnapshot = await getDocs(commentsRef);
          commentsCount += commentsSnapshot.size;
        }

        // Update stats with actual data
        setStats({
          postCount: userPosts.length,
          viewersCount,
          reactionsCount,
          commentsCount,
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

  const handleEditPost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      setSelectedPostData(postSnap.data());
      setSelectedPostId(postId);
      setEditPostOpen(true);
    }
  };

  const handleCloseEditPost = () => {
    setEditPostOpen(false);
    setSelectedPostId(null);
  };

  const handleSavePostEdit = async (updatedPostData) => {
    if (!selectedPostId) return;

    try {
      const postRef = doc(db, 'posts', selectedPostId);
      await updateDoc(postRef, updatedPostData);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPostId ? { ...post, ...updatedPostData } : post
        )
      );
      handleCloseEditPost();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setStats((prevStats) => ({ ...prevStats, postCount: prevStats.postCount - 1 }));
    } catch (error) {
      console.error('Error deleting post:', error);
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
        viewersCount={stats.viewersCount}
        reactionsCount={stats.reactionsCount}
        commentsCount={stats.commentsCount}
      />
      <UserPosts posts={posts} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />

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

      {/* Edit Post Modal */}
      <EditPostModal
        open={editPostOpen}
        onClose={handleCloseEditPost}
        postId={selectedPostId}
        postDetails={selectedPostData}
        onSave={handleSavePostEdit}
      />
    </Container>
  );
}

export default Profile;

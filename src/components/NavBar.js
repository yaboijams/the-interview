import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';

function Navbar({ toggleTheme, isDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Use media query to check if screen size is small
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <List sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/create">
        <ListItemText primary="Create Post" />
      </ListItem>
      <ListItem button component={Link} to="/profile">
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button component={Link} to="/login">
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem>
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>The Interview</Link>
        </Typography>

        {/* Conditional Rendering */}
        {isMobile ? (
          // Mobile: Show Menu Icon
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          // Desktop: Show Links in Navbar
          <div>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/create">Create Post</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </div>
        )}
      </Toolbar>

      {/* Drawer for Mobile View */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;

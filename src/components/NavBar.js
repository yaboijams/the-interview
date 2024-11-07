import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Drawer, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';

function Navbar({ toggleTheme, isDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  const drawerContent = (
    <List
      sx={{
        width: 250,
        height: '100%',
        padding: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
        The Interview
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {['Home', 'Create', 'Profile'].map((text, index) => (
        <ListItem
          button
          component={Link}
          to={text === 'Home' ? '/' : `/${text.toLowerCase().replace(' ', '')}`}
          key={index}
          onClick={handleLinkClick}
          sx={{
            borderRadius: 2,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            mb: 1,
            mx: 1,
          }}
        >
          <ListItemText
            primary={text}
            primaryTypographyProps={{
              fontSize: '1rem',
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          />
        </ListItem>
      ))}

      <ListItem sx={{ justifyContent: 'center', mt: 2 }}>
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" color="primary" sx={{ boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            The Interview
          </Link>
        </Typography>

        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ ml: 1 }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        ) : (
          <div>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/create">Create Post</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </div>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            height: '100vh',
            boxShadow: theme.shadows[5],
            transition: theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;

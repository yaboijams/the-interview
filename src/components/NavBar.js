import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Drawer, IconButton, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';
import logo from '../assets/TitleBlueIE.png'; // Adjust the path to your assets folder if necessary

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
      <Box display="flex" justifyContent="center" mb={2}>
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="The Interview Logo" style={{ width: '80px', height: 'auto' }} />
        </Link>
      </Box>
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
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="The Interview Logo" style={{ width: '40px', height: 'auto', marginRight: '8px' }} />
            {/* <Typography variant="h6" sx={{ fontWeight: 700 }}>
              The Interview
            </Typography> */}
          </Link>
        </Box>

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

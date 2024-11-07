// src/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#002875',  // Deep Blue for primary elements
      light: '#5b9bd5', // Lighter blue for hover effects
      dark: '#001a4d',  // Very dark blue for active states
    },
    secondary: {
      main: '#313335',  // Dark Gray for secondary accents
      light: '#86888a', // Medium Gray for secondary elements
      dark: '#1b1d1e',  // Almost black for high-emphasis elements
    },
    background: {
      default: '#dcddde', // Light neutral background for overall app
      paper: '#ffffff',   // White for cards and papers
      light: '#e8ebed',   // Slightly darker for section backgrounds
      dark: '#caccce',    // Light Gray for additional contrast
    },
    text: {
      primary: '#000000',   // Black for primary text
      secondary: '#313335', // Dark Gray for secondary text
      muted: '#86888a',     // Medium Gray for subtle text
    },
    action: {
      hover: '#e1f0fa',      // Soft blue hover background
      selected: '#caccce',   // Light Gray selected background for items
      highlight: '#ffb74d',  // Amber for notifications or important actions
    },
    divider: '#e0e0e0',     // Light Gray for dividers and borders
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',  // Softer blue for primary elements in dark mode
      light: '#90caf9', // Bright blue for hover effects
      dark: '#002875',  // Deep Blue as a bold accent
    },
    secondary: {
      main: '#9e9e9e',  // Light Gray for secondary accents
      light: '#bdbdbd', // Medium Gray for subtle contrast
      dark: '#616161',  // Dark Gray for emphasis
    },
    background: {
      default: '#121212', // Very dark background for main content
      paper: '#1e1e1e',   // Slightly lighter background for cards and papers
      light: '#333333',   // Mid-tone gray for sections needing contrast
      dark: '#000000',    // Black for headers or footers
    },
    text: {
      primary: '#ffffff',  // White for readability
      secondary: '#cfcfcf', // Light Gray for secondary text
      muted: '#9e9e9e',     // Medium Gray for muted text
    },
    action: {
      hover: '#1e88e5',  // Brighter blue for hover effects
      selected: '#616161', // Dark Gray for selected items
      highlight: '#ff7043',  // Coral for notifications or calls-to-action
    },
    divider: '#333333', // Subtle divider for separation without high contrast
  },
});

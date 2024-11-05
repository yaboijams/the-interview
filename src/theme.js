// src/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0077b5',  // LinkedIn Blue
      light: '#5b9bd5', // Lighter blue for hover effects
      dark: '#005582',  // Darker blue for active states
    },
    secondary: {
      main: '#313335',  // Dark Gray for secondary accents
      light: '#86888a', // Medium Gray for secondary elements
      dark: '#000000',  // Black for emphasis (e.g., headings)
    },
    background: {
      default: '#f3f4f6', // Light neutral background for overall app
      paper: '#ffffff',   // White for cards and papers
      light: '#e8ebed',   // Slightly darker for section backgrounds
      dark: '#caccce',    // LinkedIn Light Gray for additional contrast
    },
    text: {
      primary: '#000000',   // Black for primary text
      secondary: '#313335', // Dark Gray for secondary text
      muted: '#86888a',     // LinkedIn Medium Gray for subtle text
    },
    action: {
      hover: '#e1f0fa', // Soft blue hover background
      selected: '#caccce', // Gray selected background for items
    },
    divider: '#e0e0e0', // Light Gray for dividers and borders
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',  // Softer blue for primary elements in dark mode
      light: '#90caf9', // Lighter blue for hover effects
      dark: '#0077b5',  // LinkedIn Blue as a bold accent
    },
    secondary: {
      main: '#9e9e9e',  // Light Gray for secondary accents
      light: '#bdbdbd', // Medium Gray for softer contrast elements
      dark: '#616161',  // Dark Gray for emphasis in secondary items
    },
    background: {
      default: '#121212', // Very dark background for main content
      paper: '#1e1e1e',   // Slightly lighter dark background for cards and papers
      light: '#333333',   // A mid-tone gray for sections that need subtle contrast
      dark: '#000000',    // Black for deep contrast areas (e.g., headers or footers)
    },
    text: {
      primary: '#ffffff',  // White for primary text for readability
      secondary: '#cfcfcf', // Light Gray for secondary text for a softer contrast
      muted: '#9e9e9e',     // Medium Gray for muted or less prominent text
    },
    action: {
      hover: '#1e88e5',  // Brighter blue for hover effects on dark backgrounds
      selected: '#616161', // Dark Gray for selected items to stand out
    },
    divider: '#333333', // Subtle divider to create separation without high contrast
  },
});

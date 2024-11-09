// src/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#b83a14',   // Rich, earthy red-orange for primary actions
      light: '#f3742b',  // Subtle muted orange for hover effects
      dark: '#612e37',   // Deep, refined red for active states
    },
    secondary: {
      main: '#fed172',   // Soft, premium gold for secondary highlights
      light: '#f9e1a1',  // Lighter gold for hover effects on secondary actions
      dark: '#b89d57',   // Muted gold for subtle emphasis
    },
    background: {
      default: '#f5f5f5', // Very light, almost white, neutral background
      paper: '#ffffff',   // Pure white for card and container backgrounds
      light: '#e8ebed',   // Light neutral gray for additional sections
      dark: '#d1d1d1',    // Light gray for subtle section contrasts
    },
    text: {
      primary: '#231650', // Deep, luxurious purple for primary text
      secondary: '#313335', // Dark gray for secondary text
      muted: '#86888a',     // Soft gray for muted text elements
    },
    action: {
      hover: '#f3c88a',     // Muted peach for hover effects on action items
      selected: '#e8ebed',  // Light gray for selected items
      highlight: '#b83a14', // Rich red-orange for critical actions
    },
    divider: '#dadada',     // Subtle gray for dividers and borders
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f3742b',    // Warm, refined orange for primary actions
      light: '#fed172',   // Premium gold for hover highlights
      dark: '#b83a14',    // Rich red-orange for active or pressed states
    },
    secondary: {
      main: '#86888a',    // Neutral medium gray for secondary elements
      light: '#bdbdbd',   // Soft, light gray for softer secondary accents
      dark: '#4a4a4a',    // Darker gray for high-emphasis elements
    },
    background: {
      default: '#181818', // Almost black background for a sleek, high-end feel
      paper: '#232323',   // Dark gray for card and container backgrounds
      light: '#333333',   // Medium dark gray for subtle contrast
      dark: '#0d0d0d',    // Black for headers and footers
    },
    text: {
      primary: '#f5f5f5', // Off-white for readability without harsh contrast
      secondary: '#c7c7c7', // Soft gray for secondary text
      muted: '#86888a',     // Medium gray for muted text
    },
    action: {
      hover: '#b83a14',    // Rich red-orange for hover on interactive items
      selected: '#333333', // Dark gray for selected backgrounds
      highlight: '#fed172', // Subtle gold for attention-grabbing actions
    },
    divider: '#2a2a2a',    // Dark gray divider for minimal contrast separation
  },
});

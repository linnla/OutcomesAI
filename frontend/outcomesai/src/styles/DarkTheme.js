import { createTheme } from '@mui/material/styles';

const DarkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ff6f00',
    },
    secondary: {
      main: '#9c27b0',
    },
    error: {
      main: '#f44336',
    },
    // ...
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '36px',
      color: '#ffffff',
      lineHeight: '1.2',
    },
    h2: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#ffffff',
      lineHeight: '1.2',
    },
    h3: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#ffffff',
      lineHeight: '1.2',
    },
    body1: {
      fontSize: '16px',
      color: '#ffffff',
      lineHeight: '1.4',
    },
    button: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      textTransform: 'uppercase',
    },
    // ...
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333', // Custom background color for AppBar
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between', // Align items to the left and right
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Custom text color for Typography
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: '#ff6f00',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#ff8124',
          },
        },
        containedSecondary: {
          backgroundColor: '#9c27b0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#af52c7',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    // Add more component styles as needed
    // ...
  },
});

export default DarkTheme;

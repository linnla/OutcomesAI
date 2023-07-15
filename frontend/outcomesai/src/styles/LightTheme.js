import { createTheme } from '@mui/material/styles';

const LightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '36px',
      color: '#333333',
      lineHeight: '1.2',
    },
    h2: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#333333',
      lineHeight: '1.2',
    },
    h3: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#333333',
      lineHeight: '1.2',
    },
    body1: {
      fontSize: '16px',
      color: '#666666',
      lineHeight: '1.4',
    },
    button: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '16px',
      textTransform: 'uppercase',
    },
  },
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#333333',
    },
    error: {
      main: '#dc3545',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Custom background color for AppBar
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
          color: '#333333', // Custom text color for Typography
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
          backgroundColor: '#007bff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
        containedSecondary: {
          backgroundColor: '#ffffff',
          color: '#333333',
          border: '1px solid #333333',
          '&:hover': {
            backgroundColor: '#f5f5f5',
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

export default LightTheme;

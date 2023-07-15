import React from 'react';
import { Button, Typography } from '@mui/material';
import backgroundImage from '../images/AI-in-Mental-Health.jpg'; // Update the image path

function SplashPage() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
      }}
    >
      <Typography
        variant='h1'
        component='h1'
        color='textPrimary'
        sx={{ mb: 2 }}
      >
        OutcomesAI
      </Typography>
      <Typography
        variant='h4'
        component='h2'
        color='textSecondary'
        sx={{ mb: 4 }}
      >
        Transforming Mental Health with AI
      </Typography>
      <Button
        variant='contained'
        color='primary'
        sx={{
          py: 2, // Increase the padding vertically
          px: 7, // Increase the padding horizontally
          fontSize: '1.5rem', // Increase the font size
        }}
      >
        Login
      </Button>
    </div>
  );
}

export default SplashPage;

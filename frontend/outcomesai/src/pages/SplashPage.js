import React, { useState } from 'react';
import WebPageLayout from '../components/WebPageLayout';
import { Button, Typography } from '@mui/material';
import backgroundImage from '../images/AI-in-Mental-Health.jpg';
import LoginPage from '../pages/LoginPage';
import '../styles/SplashPage.css';

function SplashPage() {
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  const handleLoginClick = () => {
    setIsLoginVisible(false);
  };

  const title = 'Splash Page';
  const metaTags = [
    {
      name: 'description',
      content: 'This is the splash page of the app OutcomesAI.',
    },
    // Add more meta tags as needed
  ];

  return (
    <WebPageLayout title={title} metaTags={metaTags}>
      <div className='splash-page'>
        <div
          className='splash-image'
          style={{
            backgroundImage: `url(${backgroundImage})`,
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
          {isLoginVisible && (
            <Button
              variant='contained'
              color='primary'
              sx={{
                py: 2,
                px: 7,
                fontSize: '1.5rem',
              }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
          {!isLoginVisible && <LoginPage />}
        </div>
      </div>
    </WebPageLayout>
  );
}

export default SplashPage;

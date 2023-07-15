import React, { useState } from 'react';
import WebPageLayout from '../components/WebPageLayout';
import { Button, Typography } from '@mui/material';
import LoginPage from '../pages/LoginPage';
import '../styles/SplashPage.css';

function SplashPage() {
  const [isLoginVisible, setIsLoginVisible] = useState(false); // Set initial state to false

  const handleLoginClick = () => {
    setIsLoginVisible(true); // Update state when login button is clicked
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
        <div className='container'>
          <div className='tag-line'>
            <Typography variant='h3' component='h1' color='textPrimary'>
              Experience the power
              <br />
              of data-driven
              <br />
              mental health care
            </Typography>
          </div>
          <div className='description'>
            <Typography variant='p1' component='h2' color='textSecondary'>
              Combining outcome tracking and procedure monitoring, <br />
              our platform provides a comprehensive solution for <br />
              improving mental wellbeing.
            </Typography>
          </div>
          <div className='buttons'>
            <div className='buttons-wrapper'>
              <Button
                variant='contained'
                color='primary'
                sx={{
                  py: 2,
                  px: 8,
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                }}
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                variant='contained'
                color='secondary'
                sx={{
                  py: 2,
                  px: 8,
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                }}
                // Add onClick handler for the second button if needed
              >
                Register
              </Button>
            </div>
          </div>
        </div>
        {isLoginVisible && (
          <div className='login-page'>
            <LoginPage />
          </div>
        )}
      </div>
    </WebPageLayout>
  );
}

export default SplashPage;

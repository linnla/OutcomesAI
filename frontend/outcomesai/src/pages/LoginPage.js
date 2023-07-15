import React, { useState, useEffect } from 'react';
import WebPageLayout from '../components/WebPageLayout';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { queryTable } from '../api/Api';
import { createRecord } from '../api/Api';

function LoginPage() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const title = 'Login Page';
  const metaTags = [
    {
      name: 'description',
      content: 'This is the login page of the app OutcomesAI.',
    },
    // Add more meta tags as needed
  ];

  const fetchJwtToken = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      setJwtToken(idToken);
      sessionStorage.setItem('idToken', idToken);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  const checkUserExists = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const response = await queryTable('users', {
        email: user.attributes.email,
      });

      const statusCode = response.status;

      if (statusCode === 404) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
  };

  const createUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const newUser = {
        cognito_id: user.username,
        last_name: user.attributes.family_name,
        first_name: user.attributes.given_name,
        email: user.attributes.email,
      };

      const result = await createRecord('users', newUser);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleUserCreation = async () => {
    const userExists = await checkUserExists();

    if (!userExists) {
      await createUser();
    }
  };

  return (
    <WebPageLayout title={title} metaTags={metaTags}>
      <Authenticator
        loginMechanisms={['email']}
        signUpAttributes={['family_name', 'given_name']}
      >
        {({ signOut, user }) => {
          if (user) {
            handleUserCreation(user);
            return (
              <>
                <p>Welcome {user.attributes.given_name}</p>
                <button onClick={signOut}>Sign out</button>
              </>
            );
          } else {
            return (
              <>
                <p>Please sign in</p>
              </>
            );
          }
        }}
      </Authenticator>
    </WebPageLayout>
  );
}

export default LoginPage;

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CallApi from '../api/CallApi';
import {
  getUserData,
  getCognitoUser,
  getUserPracticeWithRetry,
} from '../utils/AuthService';

function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  const createNewUser = async () => {
    try {
      // Get the authenticated user
      const cognitoUser = await getCognitoUser();
      console.log('Cognito User:', cognitoUser);

      const method = 'POST';
      const table = 'offices';
      const body = {
        cognito_id: cognitoUser.username,
        last_name: cognitoUser.attributes.family_name,
        first_name: cognitoUser.attributes.given_name,
        email: cognitoUser.attributes.email,
      };

      try {
        const response = await CallApi(method, table, body, null);
        console.log('User record created successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating user record:', error);
        // Handle the error, such as displaying an error message to the user
        throw error; // Re-throw the error to propagate it further if needed
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle the error, such as displaying an error message to the user
      throw error; // Re-throw the error to propagate it further if needed
    }
  };

  const handleLogin = async () => {
    try {
      // Get user data
      let userData;
      try {
        userData = await getUserData();
        console.log('User Data:', userData);
      } catch (getUserDataError) {
        // CHECK FOR DATA NOT FOUND ERROR vs ANY OTHER ERROR
        // ONLY CREATENEWUSER() IF USER (DATA OR RESULT) NOT FOUND ERROR
        console.log('User data not found. Creating user...');
        // Logic to create the user
        userData = await createNewUser();
      }

      // Get practice ID with retry
      const practice_id = await getUserPracticeWithRetry();
      if (practice_id !== null) {
        console.log('Practice ID:', practice_id);
      } else {
        console.log('Practice ID not set');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
    >
      {({ user }) => {
        if (user) {
          handleLogin();
        }
      }}
    </Authenticator>
  );
}

export default Login;

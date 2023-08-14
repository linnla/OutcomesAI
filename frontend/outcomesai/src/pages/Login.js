import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ApiCallWithToken from '../api/ApiCallWithToken';
import {
  getUserData,
  getCognitoUser,
  getUserPracticeWithRetry,
} from '../components/Authenticate';

function Login() {
  const navigate = useNavigate();

  const createNewUser = async () => {
    try {
      // Get the authenticated user
      const cognitoUser = await getCognitoUser();
      console.log('Cognito User:', cognitoUser);

      const newUser = {
        cognito_id: cognitoUser.username,
        last_name: cognitoUser.attributes.family_name,
        first_name: cognitoUser.attributes.given_name,
        email: cognitoUser.attributes.email,
      };

      const response = await ApiCallWithToken('POST', 'users', { newUser });
      console.log('User record created successfully:', response.data);
      // Do something with the response, if needed
    } catch (error) {
      console.error('Error creating user record:', error);
      // Handle the error, such as displaying an error message to the user
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
      navigate('/');
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

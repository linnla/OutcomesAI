import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { queryTable } from '../api/Api';
import { createRecord } from '../api/Api';

async function handleSignOut() {
  try {
    await Auth.signOut();
    const idToken = 'idToken';
    sessionStorage.setItem('idToken', idToken);
  } catch (error) {
    console.log('Error signing out:', error);
  }
}

function Login() {
  const navigate = useNavigate();

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      sessionStorage.setItem('idToken', idToken);
      return true;
    } catch (error) {
      console.log('Error fetching JWT token:', error);
      return false;
    }
  };

  const checkUserExists = async (user) => {
    try {
      const userData = await queryTable('users', {
        email: user.attributes.email,
      });
      return userData;
    } catch (error) {
      console.log('Error checking if user exists:', error);
      return false;
    }
  };

  const createUser = async (user) => {
    try {
      const newUser = {
        cognito_id: user.username,
        last_name: user.attributes.family_name,
        first_name: user.attributes.given_name,
        email: user.attributes.email,
      };

      const response = await createRecord('users', newUser);
      if (response.status !== 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('Error creating user:', error);
      return false;
    }
  };

  const handleSignIn = async (user) => {
    try {
      const jwtToken = await fetchJwtToken();
      const userData = await checkUserExists(user);
      if (!userData) {
        const result = await createUser(user);
        if (!result) {
          return;
        }
      } else {
        const user_id = userData.data.data[0].id;
        const last_name = userData.data.data[0].last_name;
        const first_name = userData.data.data[0].first_name;
        const cognito_id = userData.data.data[0].cognito_id;
        const email = userData.data.data[0].email;

        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('first_name', first_name);
        sessionStorage.setItem('last_name', last_name);
        sessionStorage.setItem('cognito_id', cognito_id);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('practice_id', 100101);
      }
    } catch (error) {
      console.log('Error creating user:', error);
      return;
    }
    navigate('/');
  };

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
    >
      {({ user }) => {
        if (user) {
          handleSignIn(user);
        }
      }}
    </Authenticator>
  );
}

export default Login;

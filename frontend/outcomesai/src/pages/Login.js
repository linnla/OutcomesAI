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
      console.log(idToken);
      return true;
    } catch (error) {
      console.log('Error fetching JWT token:', error);
      return false;
    }
  };

  const checkUserExists = async (user) => {
    try {
      const response = await queryTable('users', {
        email: user.attributes.email,
      });

      if (response.status !== 200) {
        return false;
      } else {
        return true;
      }
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
    const jwtToken = await fetchJwtToken();
    if (jwtToken) {
      const userExists = await checkUserExists(user);
      if (!userExists) {
        await createUser(user);
      }
    } else {
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
          return (
            <>
              <p>Welcome {user.attributes.given_name}</p>
              <button onClick={handleSignOut}>Sign out</button>
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
  );
}

export default Login;

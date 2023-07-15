import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { queryTable } from './api';
import { createRecord } from './api';

function App() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken().then(handleUserCreation);
  }, []);

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
      console.log('email:', user.attributes.email);
      console.log('username:', user.username);
      console.log('family_name:', user.attributes.family_name);
      console.log('given_name:', user.attributes.given_name);

      const response = await queryTable('users', {
        email: user.attributes.email,
      });

      console.log('response:', response);
      const statusCode = response.status;
      console.log('statusCode:', statusCode);

      if (statusCode === 404) {
        console.log('User does not exist:', statusCode);
        return false;
      } else {
        console.log('User exists:', response.data);
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
      console.log('email:', user.attributes.email);
      console.log('username:', user.username);
      console.log('family_name:', user.attributes.family_name);
      console.log('given_name:', user.attributes.given_name);

      const newUser = {
        cognito_id: user.username,
        last_name: user.attributes.family_name,
        first_name: user.attributes.given_name,
        email: user.attributes.email,
      };

      const result = await createRecord('users', newUser);
      console.log('createRecord result:', result);
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
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
    >
      {({ signOut, user }) => (
        <div>
          <p>Welcome {user.attributes.given_name}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;

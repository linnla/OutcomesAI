import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken();
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

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
    >
      {({ signOut, user }) => (
        <div>
          <p>Welcome {user.attributes.given_name}</p>
          <button onClick={signOut}>Sign out</button>
          <h3>Your accessToken</h3>
        </div>
      )}
    </Authenticator>
  );
}

export default App;

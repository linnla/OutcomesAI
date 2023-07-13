import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';

function App() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  return (
    <Authenticator
      loginMechanisms={['email']}
      initialState='signIn'
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                <Authenticator.SignUp.FormFields />

                {/* Custom fields for given_name and family_name */}
                <div>
                  <label>First name</label>
                </div>
                <input
                  type='text'
                  name='given_name'
                  placeholder='Please enter your first name'
                />
                <div>
                  <label>Last name</label>
                </div>
                <input
                  type='text'
                  name='family_name'
                  placeholder='Please enter your last name'
                />
              </>
            );
          },
        },
      }}
      services={{
        async validateCustomSignUp(formData) {
          if (!formData.given_name) {
            return {
              given_name: 'First Name is required',
            };
          }
          if (!formData.family_name) {
            return {
              family_name: 'Last Name is required',
            };
          }
          if (!formData.email) {
            return {
              email: 'Email is required',
            };
          }
        },
      }}
    >
      {({ signOut, user }) => (
        <div>
          Welcome {user.username}
          <button onClick={signOut}>Sign out</button>
          <h4>Your JWT token:</h4>
          {jwtToken}
        </div>
      )}
    </Authenticator>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';

function App() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    //fetchJwtToken();
    createUser();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
      const sessionToken = `${jwtToken}`;
      sessionStorage.setItem('token', sessionToken);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  const createUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      //const user = await Auth.currentAuthenticatedUser();
      const { given_name, family_name, email } = user.attributes;
      const userInfo = {
        cognito_id: user.username,
        first_name: given_name,
        last_name: family_name,
        email,
      };

      // Retrieve the token from the session storage
      //const token = sessionStorage.getItem('token');

      // Send the user information to your API
      console.log('Token');
      console.log(token);
      const response = await fetch(
        'https://1q35lcvj4f.execute-api.us-west-2.amazonaws.com/dev/users?email=laure.linn@yahoo.com',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }, //,
          //body: JSON.stringify(userInfo),
        }
      );

      //const responseData = await response.json(); // Convert the response to JSON
      console.log('API Response:', response);

      console.log('GET request');
    } catch (error) {
      console.log('Error sending user information to API:', error);
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
          Welcome {user.attributes.given_name}
          <button onClick={signOut}>Sign out</button>
          <h4>Your JWT token:</h4>
          {jwtToken}
        </div>
      )}
    </Authenticator>
  );
}

export default App;

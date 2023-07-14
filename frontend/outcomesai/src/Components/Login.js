import React, { useState, useEffect } from 'react';
import { Authenticator, Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import awsConfig from './aws-exports';

Amplify.configure(awsConfig);

function Login() {
  const [jwtToken, setJwtToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
      sessionStorage.setItem('token', token);
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
        }, // <--- Add the comma here
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
          <h4>{jwtToken}</h4>
        </div>
      )}
    </Authenticator>
  );
}

export default Login;

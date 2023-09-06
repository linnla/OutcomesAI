import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CallApi from '../api/CallApi';
import { Auth } from 'aws-amplify';
import UserContext from '../contexts/UserContext';

function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();

  const { setUserData } = useContext(UserContext);

  let from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  const createNewUser = async () => {
    const currentUser = Auth.currentAuthenticatedUser();
    const method = 'POST';
    const table = 'users';
    const body = {
      cognito_id: currentUser.username,
      last_name: currentUser.attributes.family_name,
      first_name: currentUser.attributes.given_name,
      email: currentUser.attributes.email,
    };
    try {
      await CallApi(method, table, body, null);
      setUserData();
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  const handleLogin = async () => {
    try {
      setUserData();
    } catch (error) {
      console.log('User data not found. Creating user', error);
      await createNewUser();
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

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CallApi from '../api/CallApi';
import { Auth } from 'aws-amplify';
import UserContext from '../contexts/UserContext';

function Login({ onSuccessfulLogin }) {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();

  const { setUserData } = useContext(UserContext);
  const [loadingUserData, setLoadingUserData] = useState(false);

  let from = location.state?.from?.pathname || '/';

  const createNewUser = async () => {
    const current = await Auth.currentAuthenticatedUser();
    const method = 'POST';
    const table = 'users';
    const body = {
      cognito_id: current.username,
      last_name: current.attributes.family_name,
      first_name: current.attributes.given_name,
      email: current.attributes.email,
    };
    try {
      await CallApi(method, table, body, null);
      await setUserData();
    } catch (error) {
      console.error('createNewUser error:', error);
    }
  };

  const handleLogin = async () => {
    //console.log('handleLogin');
    setLoadingUserData(true);
    try {
      await setUserData();
    } catch (error) {
      //console.log('User data not found. Creating user', error);
      await createNewUser();
    } finally {
      setLoadingUserData(false);
      onSuccessfulLogin();
      navigate('/');
    }
  };

  // Use the shouldExecuteEffect flag to control the useEffect
  useEffect(() => {
    //console.log('login useEffect');
    const checkAndHandleLogin = async () => {
      //console.log('login checkAndHandleLogin');
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          await handleLogin();
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAndHandleLogin();

    if (route === 'authenticated' && !loadingUserData) {
      navigate(from, { replace: true });
    }
  }, [route]);

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
      onAuthEvent={async (event) => {
        console.log('login event:', event);
        if (event.type === 'signIn') {
          handleLogin();
        }
      }}
    />
  );
}

export default Login;

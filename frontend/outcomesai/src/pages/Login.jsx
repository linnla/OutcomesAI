import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CallApi from '../api/CallApi';
import { Auth } from 'aws-amplify';
import UserContext from '../contexts/UserContext';
import ShowAlert from '../utils/ShowAlert';
import { useNotificationHandling } from '../utils/NotificationHandling';

function Login({ onSuccessfulLogin }) {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const { setUserData } = useContext(UserContext);
  const [loadingUserData, setLoadingUserData] = useState(false);

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const checkAndHandleLogin = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          await handleLogin();
        }
      } catch (error) {
        handleErrorNotification(error);
      }
    };

    checkAndHandleLogin();

    if (route === 'authenticated' && !loadingUserData) {
      navigate(from, { replace: true });
    }
  }, [route]);

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
      handleErrorNotification(error);
    }
  };

  const handleLogin = async () => {
    setLoadingUserData(true);
    try {
      await setUserData();
    } catch (error) {
      console.log('User data not found. Creating user', error);
      await createNewUser();
    } finally {
      setLoadingUserData(false);
      onSuccessfulLogin();
    }
  };

  if (notificationState.showNotification) {
    return (
      <ShowAlert
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
        description={notificationState.description}
        onClose={handleClose}
      />
    );
  }

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['family_name', 'given_name']}
      onAuthEvent={async (event) => {
        if (event.type === 'signIn') {
          await handleLogin();
        }
      }}
    />
  );
}

export default Login;

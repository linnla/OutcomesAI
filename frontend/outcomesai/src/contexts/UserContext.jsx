import { createContext, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';
import { Auth } from 'aws-amplify';
import { getOne } from '../utils/API';
import { createErrorMessage } from '../utils/ErrorMessage';
import ErrorModal from '../utils/ErrorModal';

const staticDefaultUserValue = {
  role: '',
  practiceId: '',
  email: '',
  firstName: '',
  lastName: '',
};

const UserContext = createContext(staticDefaultUserValue);

function UserProvider({ children }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [user, setUser] = useState(staticDefaultUserValue);
  const [defaultUserData, setDefaultUserData] = useState(
    staticDefaultUserValue
  );

  const setUserData = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const emailAttribute = currentUser.attributes.email;

      const userData = await getOne('practice_users', {
        email: emailAttribute,
      });

      if (userData.status === 'Inactive') {
        setErrorType('Your account has been inactivated.');
        setErrorMessage('Contract your system administrator to regain access.');
        setShowErrorModal(true);
        await signOut();
      }

      //console.log('userData:', userData);
      const userDataValues = {
        role: userData.role_name,
        practiceId: userData.practice_id,
        email: emailAttribute,
        firstName: currentUser.attributes.given_name,
        lastName: currentUser.attributes.family_name,
        status: userData.status,
      };

      // Check if user data is different from current state
      if (JSON.stringify(userDataValues) !== JSON.stringify(user)) {
        setUser(userDataValues);
        setDefaultUserData(userDataValues);
      }

      return user;
    } catch (err) {
      console.error('Error getting user data:', err);
      const errorMessage = createErrorMessage(err, 'user');
      console.log('UserContext errorMessage:', errorMessage);
      setError(errorMessage);
    }
  };

  async function deleteUser() {
    try {
      const result = await Auth.deleteUser();
      console.log(result);
    } catch (error) {
      console.log('Error deleting user', error);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const userInfo = {
    ...defaultUserData,
    setUserData,
  };

  if (showErrorModal) {
    return (
      <ThemeProvider theme={theme}>
        <ErrorModal
          errorType={errorType}
          errorMessage={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </ThemeProvider>
    );
  }

  return (
    <UserContext.Provider value={userInfo}>
      <ThemeProvider theme={theme}>
        {error && (
          <ErrorModal
            errorType='User Retrieval Error'
            errorMessage={error}
            onClose={() => setError(null)}
          />
        )}
        {children}
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;

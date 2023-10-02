import { createContext, useState } from 'react';
import { Auth } from 'aws-amplify';
import { getOne } from '../utils/API';
import ErrorAlert from '../utils/ErrorAlert';
import { useErrorHandling } from '../utils/ErrorHandling';

const staticDefaultUserValue = {
  role: '',
  practiceId: '',
  email: '',
  firstName: '',
  lastName: '',
};

const UserContext = createContext(staticDefaultUserValue);

function UserProvider({ children }) {
  const { errorState, handleError, handleClose } = useErrorHandling();

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
        const customError = new Error();
        customError.name = 'Your account has been inactivated.';
        customError.message =
          'Contract your system administrator to regain access.';
        handleError(customError);
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
    } catch (error) {
      handleError(error);
    }
  };

  async function deleteUser() {
    try {
      const result = await Auth.deleteUser();
      console.log(result);
    } catch (error) {
      handleError(error);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      handleError(error);
    }
  }

  const userInfo = {
    ...defaultUserData,
    setUserData,
  };

  return (
    <UserContext.Provider value={userInfo}>
      {errorState.showError && (
        <ErrorAlert
          severity={errorState.errorSeverity}
          errorType={errorState.errorType}
          errorMessage={errorState.errorMessage}
          errorDescription={errorState.errorDescription}
          onClose={handleClose}
        />
      )}
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;

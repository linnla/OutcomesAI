import { createContext, useState } from 'react';
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
  const [user, setUser] = useState(staticDefaultUserValue);
  const [defaultUserData, setDefaultUserData] = useState(
    staticDefaultUserValue
  );
  const [error, setError] = useState(null);

  const setUserData = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const emailAttribute = currentUser.attributes.email;

      const userData = await getOne('practice_users', {
        email: emailAttribute,
      });
      //console.log('userData:', userData);
      const userDataValues = {
        role: userData.role,
        practiceId: userData.practice_id,
        email: emailAttribute,
        firstName: currentUser.attributes.given_name,
        lastName: currentUser.attributes.family_name,
      };

      // Check if user data is different from current state
      if (JSON.stringify(userDataValues) !== JSON.stringify(user)) {
        setUser(userDataValues);
        setDefaultUserData(userDataValues);
      }
    } catch (err) {
      console.error('Error getting user data:', err);
      const errorMessage = createErrorMessage(err, 'user');
      console.log('UserContext errorMessage:', errorMessage);
      setError(errorMessage);
    }
  };

  const userInfo = {
    ...defaultUserData,
    setUserData,
  };

  return (
    <UserContext.Provider value={userInfo}>
      {error && (
        <ErrorModal
          errorType='User Retrieval Error'
          errorMessage={error}
          onClose={() => setError(null)}
        />
      )}
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;

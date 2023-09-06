import { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import CallApi from '../api/CallApi';

const staticDefaultUserValue = {
  role: '',
  practiceId: '',
  email: '',
  firstName: '',
  lastName: '',
};

const UserContext = createContext(staticDefaultUserValue);

function UserProvider({ children }) {
  console.log('UserProvider Loaded');

  const [user, setUser] = useState(staticDefaultUserValue);
  const [defaultUserData, setDefaultUserData] = useState(
    staticDefaultUserValue
  );

  useEffect(() => {
    console.log("UserContext's practiceId changed:", user.practiceId);
  }, [user.practiceId]);

  const setUserData = async () => {
    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(async (currentUser) => {
          const method = 'GET';
          const table = 'practice_users';
          const query_params = {
            email: currentUser.attributes.email,
          };
          const response = await CallApi(method, table, null, query_params);
          console.log('UserContext setUserData', response.data.data[0]);
          const userData = response.data.data[0];

          const userDataValues = {
            role: 'admin',
            practiceId: userData.practice_id,
            email: currentUser.attributes.email,
            firstName: currentUser.attributes.given_name,
            lastName: currentUser.attributes.family_name,
          };

          setUser(userDataValues);

          // Update the default user data
          setDefaultUserData(userDataValues);

          resolve();
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
          reject(error);
        });
    });
  };

  const userInfo = {
    ...defaultUserData,
    setUserData,
  };

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;

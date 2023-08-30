import { Auth } from 'aws-amplify';
import CallApi from '../api/CallApi';

export const getToken = async () => {
  try {
    const session = await Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    return idToken;
  } catch (error) {
    console.log('Error getting token:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const getCognitoUser = () => {
  return new Promise((resolve, reject) => {
    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        resolve(currentUser); // Resolve with the user object
      })
      .catch((error) => {
        console.log('Error getting Cognito user:', error);
        reject(error); // Reject with the error
      });
  });
};

const getUserEmail = async () => {
  try {
    const cognitoUser = await getCognitoUser();
    const userEmail = cognitoUser.attributes.email;
    return userEmail;
  } catch (error) {
    console.error('Error getting user email:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const getUser = async () => {
  console.log('getUser start');
  try {
    const method = 'GET';
    const table = 'practice_users';
    const email = await getUserEmail();
    const query_params = {
      email: email,
    };

    const response = await CallApi(method, table, null, query_params);
    console.log('getUser response:', response.data.data[0]);
    sessionStorage.setItem('practice_id', response.data.data.practice_id);
    sessionStorage.setItem('role', response.data.data.role);
    return response.data.data[0];
  } catch (error) {
    console.log('getUser error:', error);
    throw error;
  }
};

//export const setUserPractice = async (practice_id) => {
//  sessionStorage.setItem('practice_id', practice_id);
//};

export const getUserPractice = async () => {
  const practiceId = sessionStorage.getItem('practice_id');
  console.log('AuthService getUserPractice:', practiceId);
};

//export const setUserRole = async (role) => {
//  sessionStorage.setItem('role', role);
//};

export const getUserRole = async () => {
  const role = sessionStorage.getItem('role');
  console.log('AuthService getUserRole:', role);
};

// DELETE AFTER RESOLVING BUG
export const getUserData = async () => {
  console.log('getUserData start');
  try {
    const method = 'GET';
    const table = 'practice_users';
    const email = await getUserEmail();
    const query_params = {
      email: email,
    };

    const response = await CallApi(method, table, null, query_params);
    console.log('getUserData response:', response.data.data[0]);
    return response.data.data[0];
  } catch (error) {
    console.log('getUserData error:', error);
    throw error;
  }
};

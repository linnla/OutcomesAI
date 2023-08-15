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

export const getUserData = async () => {
  try {
    const userEmail = await getUserEmail();

    const method = 'GET';
    const table = 'users';
    const query_params = {
      email: userEmail,
    };

    try {
      const response = await CallApi(method, table, null, query_params);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error; // Re-throw the error to propagate it further if needed
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error; // Re-throw the error to propagate it further if needed
  }
};

const MAX_RETRIES = 3; // Maximum number of retries

const setUserPractice = async () => {
  try {
    const practice_id = 100101;
    sessionStorage.setItem('practice_id', practice_id.toString());
    console.log('Saved practice_id to session storage');
  } catch (error) {
    console.error('Error saving practice_id to session storage:', error);
    throw error;
  }
};

const getUserPractice = async () => {
  try {
    const practice_id = sessionStorage.getItem('practice_id');
    if (practice_id === null) {
      await setUserPractice();
      throw new Error('practice_id is not set');
    }
    return parseInt(practice_id);
  } catch (error) {
    console.error('Error getting practice_id:', error);
    throw error;
  }
};

export const getUserPracticeWithRetry = async () => {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      //console.log('getUserPracticeWithRetry count:', retryCount);
      const practice_id = await getUserPractice();
      console.log(
        'Returning from getUserPracticeWithRetry with practice_id:',
        practice_id
      );
      return practice_id;
    } catch (error) {
      console.error('Error getting practice_id. Retrying...', error);
      retryCount++;
    } finally {
      console.log(`Retry attempt: ${retryCount}`);
    }
  }

  //console.error('Max retries reached. Unable to get practice_id');
  return null; // You can return null or handle this case as needed
};

import { Auth } from 'aws-amplify';
import ApiCallWithToken from '../api/ApiCallWithToken';

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
    const response = await ApiCallWithToken('GET', 'users', {
      email: userEmail,
    });
    return response;
  } catch (error) {
    console.error('Error getting user data or its a new user:', error);
    throw error; // Propagate the error up for proper handling
  }
};

const setUserPractice = async () => {
  try {
    const practice_id = 100101;
    sessionStorage.setItem('practice_id', practice_id.toString()); // Convert to string before storing
  } catch (error) {
    console.error('Error saving practice_id:', error);
    throw error; // Propagate the error up for proper handling
  }
};

const getUserPractice = async () => {
  try {
    const practice_id = sessionStorage.getItem('practice_id');
    return practice_id ? parseInt(practice_id) : null; // Parse to integer
  } catch (error) {
    console.error('Error getting practice_id:', error);
    await setUserPractice(); // Await the setUserPractice function
    throw error; // Propagate the error up for proper handling
  }
};

const MAX_RETRIES = 3; // Maximum number of retries
let retryCount = 0;

export const getUserPracticeWithRetry = async () => {
  try {
    const practice_id = await getUserPractice();
    return practice_id;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error('Error getting practice_id. Retrying...');
      retryCount++;
      return getUserPracticeWithRetry(); // Retry the function
    } else {
      console.error('Max retries reached. Unable to get practice_id:', error);
      throw error; // Propagate the error up for proper handling
    }
  }
};

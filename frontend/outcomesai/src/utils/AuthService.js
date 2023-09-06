import { Auth } from 'aws-amplify';

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

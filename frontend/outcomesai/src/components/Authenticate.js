import { Auth } from 'aws-amplify';
import { queryTable } from '../api/Api';

const checkUserExists = async (user) => {
  try {
    const userData = await queryTable('users', {
      email: user.attributes.email,
    });
    return userData;
  } catch (error) {
    console.log('Error checking if user exists:', error);
    return false;
  }
};

const logSessionData = async () => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`Key: ${key}, Value: ${value}`);
  }
};

const Authenticate = async () => {
  //logSessionData();

  try {
    const user = await Auth.currentAuthenticatedUser();
    const currentIdToken = user.signInUserSession.idToken.jwtToken;
    const savedIdToken = sessionStorage.getItem('idToken');
    if (currentIdToken !== savedIdToken) {
      console.log('Saving id token');
      sessionStorage.setItem('idToken', currentIdToken);
    }
    //console.log('User is authenticated');

    //console.log('user:', user);
    const currentCognito_id = user.username;
    const savedCognito_id = sessionStorage.getItem('cognito_id');

    //console.log('currentCognito_id:', currentCognito_id);
    //console.log('savedCognito_id:', savedCognito_id);

    if (currentCognito_id !== savedCognito_id) {
      console.log('Saving session data');
      const userData = await checkUserExists(user);
      //console.log('userData:', userData);
      if (!userData) {
        return false;
      } else {
        const user_id = userData.data.data[0].id;
        const last_name = userData.data.data[0].last_name;
        const first_name = userData.data.data[0].first_name;
        const cognito_id = userData.data.data[0].cognito_id;
        const email = userData.data.data[0].email;
        const practice_id = 100101;

        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('first_name', first_name);
        sessionStorage.setItem('last_name', last_name);
        sessionStorage.setItem('cognito_id', cognito_id);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('practice_id', 100101);
      }
    } else {
      console.log('Session data is accurate');
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default Authenticate;

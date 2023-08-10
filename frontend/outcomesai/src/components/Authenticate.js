import { Auth } from 'aws-amplify';

const Authenticate = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const currentIdToken = user.signInUserSession.idToken.jwtToken;
    const savedIdToken = sessionStorage.getItem('idToken');
    if (currentIdToken !== savedIdToken) {
      console.log('Saving id token');
      sessionStorage.setItem('idToken', currentIdToken);
    }
    console.log('User is authenticated');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default Authenticate;

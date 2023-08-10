import Authenticate from '../components/Authenticate';

const handleErrorResponse = async (error, openModal, navigate) => {
  console.log('handleErrorResponse');
  console.log('error', error);
  console.log('code', error.code);
  console.log('message', error.message);
  console.log('errorType', error.response.data.errorType);
  console.log('errorMessage', error.response.data.errorMessage);

  let errorType = error.code;
  let errorDescription = error.request.responseURL;
  let errorMessage = error.message;

  if (error.response.data.message === 'The incoming token has expired') {
    const sessionValid = await Authenticate(); // Adjust as needed
    if (!sessionValid) {
      navigate('/login');
      return;
    }
  }

  let errorObject = {};
  try {
    errorObject = JSON.parse(error.response.data);
  } catch (parseError) {
    openModal(error.code, parseError, error.message);
  }

  if ('errorType' in errorObject) {
    errorType = errorObject.errorType;
  }

  if ('errorDescription' in errorObject) {
    errorDescription = errorObject.errorDescription;
  }

  if ('errorMessage' in errorObject) {
    errorMessage = errorObject.errorMessage;
  }

  console.log(errorType);
  console.log(errorDescription);
  console.log(errorMessage);

  openModal(
    errorObject.errorType,
    errorObject.errorDescription,
    errorObject.errorMessage
  );
};

export default handleErrorResponse;

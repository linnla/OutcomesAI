import Authenticate from '../components/Authenticate';

const handleErrorResponse = async (response, openModal, navigate) => {
  if (response.response.data.message === 'The incoming token has expired') {
    const sessionValid = await Authenticate(); // Adjust as needed
    if (!sessionValid) {
      navigate('/login');
      return;
    }
  }

  try {
    const errorObject = JSON.parse(response.response.data);
    if ('errorType' in errorObject) {
      openModal({
        errorType: errorObject.errorType,
        errorDescription: errorObject.errorDescription,
        errorMessage: errorObject.errorMessage,
      });
    } else {
      openModal({
        errorType: 'Unknown error',
        errorDescription: ' ',
        errorMessage: response.response.data,
      });
    }
  } catch {
    openModal({
      errorType: 'Unknown error',
      errorDescription: ' ',
      errorMessage: response.response.data,
    });
  }
};

export default handleErrorResponse;

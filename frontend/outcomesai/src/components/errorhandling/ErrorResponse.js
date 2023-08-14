function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

const ErrorResponse = async (error, openModal, navigate) => {
  console.log('ErrorResponse Start');
  let errorType = error.code;
  let errorDescription = error.request.responseURL;
  let errorMessage = error.message;

  if (error.response.data.message === 'The incoming token has expired') {
    console.log('Token expired');
  }

  let errorObject = {};
  if (isJSON(error.response.data)) {
    errorObject = JSON.parse(error.response.data);
  } else {
    errorObject = error.response.data;
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

  console.log('ErrorResponse:', errorType, errorDescription, errorMessage);
  openModal(errorType, errorDescription, errorMessage);
};

export default ErrorResponse;

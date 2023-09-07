export function createErrorMessage(error, data) {
  //console.log('processError error', error);
  //console.log('processError data', data);

  // Default error message
  let errorMessage = 'Unknown Error';

  // Handling Axios-like error responses
  if (error?.response?.data) {
    if (error.response.data.errorType === 'DuplicateKeyError') {
      errorMessage = `${data} already exists`;
    } else if (error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data.errorMessage) {
      if (
        error.response.data.errorMessage ===
        'A database result was required but none was found'
      ) {
        errorMessage = `No ${data} found`;
      } else {
        errorMessage = error.response.data.errorMessage;
      }
    } else if (error.response.data.status) {
      const statusCode = error.response.data.status;
      if (statusCode >= 500) {
        errorMessage = 'Error accessing database or server';
      }
    }
  }
  // Handling local JavaScript Error objects
  else if (error.message) {
    errorMessage = error.message;
  }

  console.log('Error Message Created:', errorMessage);
  return errorMessage;
}

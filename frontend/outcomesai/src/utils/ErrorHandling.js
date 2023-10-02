import { useState, useCallback } from 'react';

export function useErrorHandling() {
  const [errorState, setErrorState] = useState({
    errorSeverity: '',
    errorType: '',
    errorMessage: '',
    errorDescription: '',
    showError: false,
  });

  const handleError = useCallback((error) => {
    let errorSeverity = 'error';
    let errorType = '';
    let errorMessage = '';
    let errorDescription = '';

    if (error.response && error.response.data) {
      const responseData = error.response.data;

      if (responseData.errorType === 'NoResultFound') {
        errorSeverity = 'info';
        errorType = 'No Results Found';
        errorMessage = 'No results were returned from the database';
      } else if (responseData.errorType === 'DuplicateKeyError') {
        errorType = 'Duplicate Key Error';
        errorMessage = 'You are trying to add a record that already exists';
      } else {
        errorType = responseData.errorType || '';
        errorMessage = responseData.errorMessage || '';
        errorDescription = responseData.errorDescription || '';
      }

      if (responseData.errorMessage && !responseData.errorType) {
        errorMessage = responseData.errorMessage;
      }

      if (responseData.errorDescription && !responseData.errorType) {
        errorDescription = responseData.errorDescription;
      }
    } else {
      errorType = error.name;
      errorMessage = error.message;
    }

    setErrorState({
      errorSeverity,
      errorType,
      errorMessage,
      errorDescription,
      showError: true,
    });
  }, []);

  const handleClose = useCallback(() => {
    console.log('ErrorHandling handleClose');
    setErrorState({
      errorSeverity: '',
      errorType: '',
      errorMessage: '',
      errorDescription: '',
      showError: false,
    });
  }, []);

  return {
    errorState,
    handleError,
    handleClose,
  };
}

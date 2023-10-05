import { useState, useCallback } from 'react';

export function useNotificationHandling() {
  const [notificationState, setNotificationState] = useState({
    severity: '',
    title: '',
    message: '',
    description: '',
    showNotification: false,
  });

  const handleSuccessNotification = useCallback(
    (title, message, description) => {
      let severity = 'success';

      setNotificationState({
        severity,
        title: title || 'Success',
        message: message || '',
        description: description || '',
        showNotification: true,
      });
    },
    []
  );

  const handleInfoNotification = useCallback((title, message, description) => {
    let severity = 'info';

    setNotificationState({
      severity,
      title: title || 'Information',
      message: message || '',
      description: description || '',
      showNotification: true,
    });
  }, []);

  const handleErrorNotification = useCallback((error) => {
    let severity = 'error';

    let title = '';
    let message = '';
    let description = '';

    if (error.response && error.response.data) {
      const responseData = error.response.data;

      if (responseData.errorType === 'NoResultFound') {
        severity = 'info';
        title = 'No Results Found';
        message = 'No results were returned from the database';
      } else if (responseData.errorType === 'DuplicateKeyError') {
        title = 'Duplicate Key Error';
        message = 'You are trying to add a record that already exists';
      } else {
        title = responseData.errorType || '';
        message = responseData.errorMessage || '';
        description = responseData.errorDescription || '';
      }

      if (responseData.errorMessage && !responseData.errorType) {
        message = responseData.errorMessage;
      }

      if (responseData.errorDescription && !responseData.errorType) {
        description = responseData.errorDescription;
      }
    } else {
      title = error.name;
      message = error.message;
    }

    setNotificationState({
      severity,
      title,
      message,
      description,
      showNotification: true,
    });
  }, []);

  const handleClose = useCallback(() => {
    console.log('NotificationHandling handleClose');
    setNotificationState({
      severity: '',
      title: '',
      message: '',
      description: '',
      showNotification: false,
    });
  }, []);

  return {
    notificationState,
    handleErrorNotification,
    handleSuccessNotification,
    handleInfoNotification,
    handleClose,
  };
}

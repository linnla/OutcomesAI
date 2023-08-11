export const openModal = (errorType, errorDescription, errorMessage) => {
  setErrorType(errorType);
  setErrorMessage(errorMessage);
  setErrorDescription(errorDescription);
  setModalOpen(true);
  console.log('openModal errorType:', errorType);
  console.log('openModal errorDescription:', errorDescription);
  console.log('openModal errorMessage:', errorMessage);
};

export const closeModal = () => {
  setErrorType(null);
  setErrorMessage(null);
  setErrorDescription(null);
  setModalOpen(false);
};

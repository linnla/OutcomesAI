import React from 'react';
import { useNavigate } from 'react-router-dom';

const HandleTokenError = ({ error }) => {
  const navigate = useNavigate();

  if (error.response && error.response.status === 401) {
    // Token is not valid, route user to login page
    navigate('/login');
  }
  throw error; // Re-throw the error to be caught by the caller
};

export default HandleTokenError;

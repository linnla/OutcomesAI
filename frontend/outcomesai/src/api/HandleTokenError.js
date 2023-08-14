import { useNavigate } from 'react-router-dom';

export const HandleTokenError = () => {
  const navigate = useNavigate();

  return (error) => {
    if (error.response && error.response.status === 401) {
      // Token is not valid, route user to login page
      navigate('/login');
    }
    throw error; // Re-throw the error to be caught by the caller
  };
};

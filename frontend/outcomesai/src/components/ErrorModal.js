import { tokens } from '../theme';
import { Box, Typography, useTheme } from '@mui/material';
import '../styles/ErrorModal.css';

function ErrorModal(props) {
  const { errorType, errorDescription, errorMessage, onClose } = props;

  console.log('ErrorModal', errorMessage);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const errorModalStyle = {
    backgroundColor: colors.grey[300], // Adjust the shade as needed
    color: 'black', // Adjust text color as needed
  };

  return (
    <div className='modal'>
      <div className='modal-content' style={errorModalStyle}>
        <Box mb='30px'>
          <Typography
            variant='h2'
            color={colors.grey[100]}
            fontWeight='bold'
            sx={{ m: '0 0 5px 0' }}
          >
            Error
          </Typography>
          <Typography variant='h5' color={colors.grey[100]}>
            {errorType}
          </Typography>
          <Typography variant='h5' color={colors.grey[100]}>
            {errorDescription}
          </Typography>
          <Typography variant='h5' color={colors.grey[100]}>
            {errorMessage}
          </Typography>
        </Box>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ErrorModal;

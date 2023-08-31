import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { tokens } from '../theme';
import { Box, Typography, useTheme } from '@mui/material';
import '../styles/ErrorModal.css';
import { additionalProperties } from 'serverless/lib/config-schema';

function ErrorModal(props) {
  const { errorType, errorMessage, onClose } = props;

  console.log('ErrorModal props', additionalProperties);

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
            {errorType}
          </Typography>
          <Typography variant='h3' color={colors.grey[100]}>
            {errorMessage
              .split(/([.:])/)
              .reduce((acc, part, index) => {
                if (index % 2 === 0) {
                  return acc.concat(part);
                } else {
                  const lastPart = acc.pop();
                  return acc.concat(lastPart + part + '<br />');
                }
              }, [])
              .map((part, index) => (
                <React.Fragment key={index}>
                  {ReactHtmlParser(part)}
                </React.Fragment>
              ))}
          </Typography>
        </Box>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ErrorModal;

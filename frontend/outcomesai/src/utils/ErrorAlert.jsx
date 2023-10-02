import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

function ErrorAlert({
  errorType,
  errorMessage,
  errorDescription,
  onClose,
  severity,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    console.log('ErrorAlert handleClose');
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{ mb: 2 }}
          severity={severity}
        >
          <AlertTitle>{errorType}</AlertTitle>
          <strong>{errorMessage}</strong>
          <Typography variant='body1' component='div'>
            {errorDescription}
          </Typography>
        </Alert>
      </Collapse>
    </Box>
  );
}

export default ErrorAlert;

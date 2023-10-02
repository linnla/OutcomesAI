import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import { Typography, Box, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function SuccessSnackbar({ open, onClose, title, message, description }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={onClose}
    >
      <Alert
        variant='outlined'
        sx={{ mb: 2, maxWidth: '800px' }}
        severity='success'
      >
        <AlertTitle>{title}</AlertTitle>
        <strong>{message}</strong>
        <Typography variant='body1' component='div'>
          {description}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

function ErrorAlert({ open, onClose, title, message, description, severity }) {
  return (
    <Collapse in={open}>
      <Alert
        variant='outlined'
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={onClose}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
        sx={{ mb: 2, maxWidth: '800px' }}
        severity={severity}
      >
        <AlertTitle>{title}</AlertTitle>
        <strong>{message}</strong>
        <Typography variant='body1' component='div'>
          {description}
        </Typography>
      </Alert>
    </Collapse>
  );
}

function ShowAlert({ title, message, description, onClose, severity }) {
  console.log('ShowAlert title:', title);
  console.log('ShowAlert message:', message);

  if (title === undefined || title === '') {
    return; // Return early
  }

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    console.log('ShowAlert handleClose');
    setIsOpen(false);
    onClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '100%',
        padding: '200px',
      }}
    >
      {severity === 'success' ? (
        <SuccessSnackbar
          open={isOpen}
          onClose={handleClose}
          title={title}
          message={message}
          description={description}
        />
      ) : (
        <ErrorAlert
          open={isOpen}
          onClose={handleClose}
          title={title}
          message={message}
          description={description}
          severity={severity}
        />
      )}
    </Box>
  );
}

export default ShowAlert;

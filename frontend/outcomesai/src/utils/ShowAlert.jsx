import React, { useState, useEffect } from 'react';
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

function InfoSnackbar({ open, onClose, title, message, description }) {
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
        severity='info' // Set the severity to 'info' for an info Snackbar
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
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (title === undefined || title === '') {
      setIsOpen(false); // Close the alert if title is undefined or empty
    } else {
      setIsOpen(true); // Open the alert if title is defined and not empty
    }
  }, [title]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) {
    return null; // Return early without rendering anything if the alert is closed
  }

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
      ) : severity === 'info' ? ( // Check for 'info' severity
        <InfoSnackbar
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

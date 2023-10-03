function ShowAlert({ title, message, description, onClose, severity }) {
  console.log('ShowAlert title:', title);
  console.log('ShowAlert message:', message);

  if (title === undefined || title === '') {
    return null; // Return early without rendering anything
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

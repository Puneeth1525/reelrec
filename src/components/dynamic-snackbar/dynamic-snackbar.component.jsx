import React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import MuiAlert from '@mui/joy/Alert';

const CustomSnackbar = ({ open, message, severity, onClose }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;

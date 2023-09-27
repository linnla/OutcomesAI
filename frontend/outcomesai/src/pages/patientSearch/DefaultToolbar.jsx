import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import '../../styles/styles.css';
import { postData } from '../../utils/API';

function AddRecordDialog({ open, onClose }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dynamically set the --primary-color variable
  document.documentElement.style.setProperty(
    '--primary-color',
    colors.primary[400]
  );

  // Separate state variables for each input field
  const [chartIdValue, setChartIdValue] = useState('');

  const handleChartIdChange = (event) => {
    setChartIdValue(event.target.value);
  };

  async function drchronoPatient(fields) {
    await postData('drchrono_patient', fields);
  }

  const handleSearchClick = async () => {
    console.log('handleClickSearch:', chartIdValue);
    const fields = {
      chart_id: chartIdValue,
    };
    const patient = await drchronoPatient(fields);
    console.log('Patient:', patient);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className='dialogContent'>
        <Box>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: colors.grey[200],
              marginBottom: '10px',
            }}
          >
            Input Chart ID
          </div>
        </Box>
        <TextField
          sx={{
            backgroundColor: colors.grey[100],
            fontSize: '20px',
            fontWeight: 'bold',
          }}
          fullWidth
          variant='filled'
          type='text'
          label='Chart ID'
          name='chart_id'
          value={chartIdValue}
          onChange={handleChartIdChange}
          InputProps={{
            style: {
              color: colors.grey[500], // Change the text color here
            },
            inputProps: {
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: colors.grey[800], // Change the input text color specifically for this input
              },
            },
          }}
          InputLabelProps={{
            style: {
              fontWeight: 'bold',
              color: colors.grey[500], // Change the placeholder text color here
            },
          }}
        />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '16px',
            padding: '10px 20px',
          }}
          variant='contained'
          onClick={handleSearchClick}
        >
          Search
        </Button>
        {/* Your form content */}
        {/* You can add more form fields and buttons here */}
      </DialogContent>
    </Dialog>
  );
}

function DefaultToolbar(props) {
  const { columns } = props;

  const [openDialog, setOpenDialog] = useState(false);

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
      <Button
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        Add Patient
      </Button>
      <AddRecordDialog open={openDialog} onClose={handleCloseDialog} />
    </GridToolbarContainer>
  );
}

export default DefaultToolbar;

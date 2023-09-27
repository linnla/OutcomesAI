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

  // Separate state variables for each input field and patient data
  const [lastName, setLastName] = useState('');
  const [formatedNameslist, setFormatedNamesList] = useState('');
  const [patientData, setPatientData] = useState(null); // State for patient data

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  async function drchronoPatient(fields) {
    try {
      const patientData = await postData('drchrono_patient', fields);

      if (patientData && patientData.data && patientData.data.length > 0) {
        // Create an array of formatted strings for each patient
        const formattedPatients = patientData.data.map((patient) => {
          const fullName = patient.last_name + ', ' + patient.first_name;
          return fullName + '   ' + patient.birthdate;
        });

        // Set the entire patient data in state if needed
        setFormatedNamesList(formattedPatients);
        setPatientData(patientData);

        // You can similarly extract other data properties if needed
        // const firstName = patientData.data[0].first_name;
        // const email = patientData.data[0].email;
      } else {
        // Handle the case where no data is returned or the data array is empty
        // You can set appropriate default values or handle it as needed
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientData(null); // Reset patient data if an error occurs
    }
  }

  const handleSearchClick = async () => {
    console.log('handleClickSearch:', lastName);
    const fields = {
      last_name: lastName,
    };
    await drchronoPatient(fields); // Fetch patient data
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
            Input Last Name
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
          label='Last Name'
          name='last_name'
          value={lastName}
          onChange={handleLastNameChange}
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
        {formattedPatients && (
          <div>
            <h2>Patient Data</h2>
            {formattedPatients.map((formattedPatient, index) => (
              <div key={index}>{formattedPatient}</div>
            ))}
          </div>
        )}
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

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
  const [firstName, setFirstName] = useState('');
  const [patientData, setPatientData] = useState([]); // State for patient data

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  async function drchronoPatient(fields) {
    try {
      const patientData = await postData('drchrono_patient', fields);

      if (patientData && patientData.data && patientData.data.length > 0) {
        // Set the patient data in state
        setPatientData(patientData.data);
      } else {
        // Handle the case where no data is returned or the data array is empty
        // You can set appropriate default values or handle it as needed
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientData([]); // Reset patient data if an error occurs
    }
  }

  const handleSearchClick = async () => {
    console.log('handleClickSearch:', lastName, firstName);
    const fields = {
      last_name: lastName,
      first_name: firstName,
    };
    await drchronoPatient(fields); // Fetch patient data
  };

  // Function to add a patient
  const handleAddPatient = async (patient) => {
    // You can perform the add action here using patient data
    console.log('Adding patient:', patient);
    patient.birthdate = patient['date_of_birth'];
    // Add your logic to add the patient here
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
            Input Name
          </div>
        </Box>
        <div style={{ display: 'flex', gap: '10px' }}>
          <TextField
            sx={{
              backgroundColor: colors.grey[100],
              fontSize: '20px',
              fontWeight: 'bold',
              marginRight: '0', // Remove right margin
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
          <TextField
            sx={{
              backgroundColor: colors.grey[100],
              fontSize: '20px',
              fontWeight: 'bold',
              marginRight: '0', // Remove right margin
            }}
            fullWidth
            variant='filled'
            type='text'
            label='First Name'
            name='first_name'
            value={firstName}
            onChange={handleFirstNameChange}
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
        </div>
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
        {patientData.length > 0 && (
          <div>
            <h2>Patient Data</h2>
            {patientData.map((patient, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  label='Last Name'
                  fullWidth
                  variant='filled'
                  value={patient.last_name}
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: colors.primary[400], // Background color same as search text fields
                      marginRight: '0', // Remove right margin
                    },
                  }}
                />
                <TextField
                  label='First Name'
                  fullWidth
                  variant='filled'
                  value={patient.first_name}
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: colors.primary[400], // Background color same as search text fields
                      marginRight: '0', // Remove right margin
                    },
                  }}
                />
                <TextField
                  label='Date of Birth'
                  fullWidth
                  variant='filled'
                  value={patient.date_of_birth}
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: colors.primary[400], // Background color same as search text fields
                    },
                  }}
                />
                <Button
                  sx={{
                    backgroundColor: colors.blueAccent[700], // Same color as the search button
                    color: colors.grey[100],
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginTop: '16px',
                    minWidth: '100px', // Wider button
                    padding: '5px 10px', // Adjust padding for button height
                  }}
                  variant='contained'
                  onClick={() => handleAddPatient(patient)}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
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

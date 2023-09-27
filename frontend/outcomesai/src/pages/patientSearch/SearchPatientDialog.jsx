import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import '../../styles/styles.css';
import { getDrchronoData, getOne, postData } from '../../utils/API';
import UserContext from '../../contexts/UserContext';

export function SearchPatientDialog({ open, onClose }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role, practiceId } = useContext(UserContext);

  // Dynamically set the --primary-color variable
  document.documentElement.style.setProperty(
    '--primary-color',
    colors.primary[400]
  );

  // Separate state variables for each input field and patient data
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [chartID, setChartID] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [patientData, setPatientData] = useState([]); // State for patient data

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    setChartID('');
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    setChartID('');
  };

  const handleChartIDChange = (event) => {
    setChartID(event.target.value);
    setLastName(''); // Reset last name field
    setFirstName(''); // Reset first name field
  };

  async function drchronoPatient(fields) {
    try {
      const response = await getDrchronoData('drchrono_patient', fields);
      if (Array.isArray(response)) {
        setPatientData(response);
      } else {
        setPatientData([]);
        setLastName(''); // Reset last name field
        setFirstName(''); // Reset first name field
        setChartID(''); // Reset chart ID field
        console.log('Patient not found', response);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatientData([]);
    }
  }

  const handleSearchClick = async () => {
    console.log('handleClickSearch:', lastName, firstName);
    setSearchAttempted(false);
    setIsSearching(true);
    let fields = {};

    // Search by Chart ID OR Last Name and/or First Name
    // Conditionally add Chart ID if it's not empty
    if (chartID !== '') {
      fields.chart_id = chartID;
    } else {
      // Conditionally add Chart ID if it's not empty
      if (lastName !== '') {
        fields.last_name = lastName;
      }
      if (firstName !== '') {
        fields.first_name = firstName;
      }
    }

    if (Object.keys(fields).length > 0) {
      console.log('fields contains data');
      await drchronoPatient(fields); // Fetch patient data
      setSearchAttempted(true);
      setIsSearching(false);
    } else {
      // fields is empty
      console.log('fields is empty');
    }
  };

  // Function to add a patient
  const handleAddPatient = async (patient) => {
    // You can perform the add action here using patient data
    console.log('Adding patient:', patient);

    if (patient['date_of_birth']) {
      patient.birthdate = patient['date_of_birth'];
    } // Added closing brace for the first if

    if (patient['gender']) {
      if ((patient['gender'] = 'Male')) {
        patient.gender_birth = 'M';
      } else if ((patient['gender'] = 'Female')) {
        patient.gender_birth = 'F';
      }
    } // Added closing brace for the first if

    if (patient['zip_code']) {
      patient.postal_code = patient['zip_code'];
      const zipInfo = await getOne('postal_codes', {
        postal_code: patient['zip_code'],
      });
      patient.city = zipInfo['city'];
      patient.county = zipInfo['county'];
      patient.state = zipInfo['state'];
      patient.state_code = zipInfo['state_code'];
      patient.country_code = zipInfo['country_code'];
    } else {
      if (patient['state']) {
        patient.state_code = patient['state'];
      }
    } // Added closing brace for the second if

    patient.ehr_id = patient['id'];
    delete patient.id;

    if (patient['cell_phone']) {
      patient.cell_phone = patient['cell_phone'].replace(/\D/g, '');
    }

    try {
      console.log('Adding patient:', patient);
      const data = await postData('patients', patient);

      // Add the id returned from the database
      patient.id = data.data.id;

      const practicePatient = {
        practice_id: practiceId,
        patient_id: patient.id,
        chart_id: patient['chart_id'],
        ehr_id: patient['ehr_id'],
        status: 'Active',
      };
      await postData('practice_patients', practicePatient);
    } catch (error) {
      console.error(error);
    }
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
            Search by Patient Name or DrChrono Chart ID
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
            label='Chart ID'
            name='chart_id'
            value={chartID}
            onChange={handleChartIDChange}
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
        {/* Flashing "searching..." text */}
        {isSearching && (
          <span
            className='flashing-text'
            style={{
              marginLeft: '25px',
              color: colors.greenAccent[500], // Access the primary color from the theme
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            searching...
          </span>
        )}
        {/* No data found message */}
        {searchAttempted && patientData.length === 0 && (
          <div
            style={{
              color: colors.redAccent[500],
              marginTop: '15px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            No patient found with the provided details.
          </div>
        )}

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

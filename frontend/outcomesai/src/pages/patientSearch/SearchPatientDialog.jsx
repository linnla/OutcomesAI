import React, { useState, useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import '../../styles/styles.css';
import { getDrchronoData, getOne, postData } from '../../utils/API';
import UserContext from '../../contexts/UserContext';

export function SearchPatientDialog({ open, onClose, reset, rows }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role, practiceId } = useContext(UserContext);

  useEffect(() => {
    setChartID('');
    setLastName('');
    setFirstName('');
    setSearchAttempted(false);
    setIsSearching(false);
    setAddSuccessStates([]);
    setSavingStates([]);
    setPatientData([]);
  }, []);

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

  // Initialize an array to track the success state for each patient
  const [addSuccessStates, setAddSuccessStates] = useState([]);

  // Initialize an array to track the when patient is in adding state
  const [savingStates, setSavingStates] = useState([]);
  const [patientData, setPatientData] = useState([]); // State for patient data

  useEffect(() => {
    setChartID('');
    setLastName('');
    setFirstName('');
    setSearchAttempted(false);
    setIsSearching(false);
    setAddSuccessStates([]);
    setSavingStates([]);
    setPatientData([]);
  }, [reset]);

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
    console.log('SearchPatientDialog rows:', rows);
    try {
      const response = await getDrchronoData('drchrono_patient', fields);
      if (Array.isArray(response)) {
        const sortedPatientData = [...response].sort((a, b) => {
          const fullNameA = a.last_name + a.first_name;
          const fullNameB = b.last_name + b.first_name;

          return fullNameA.localeCompare(fullNameB);
        });

        // Loop through sortedPatientData and if one of the patients is already in the datagrid
        const updatedSuccessStates = [...addSuccessStates];
        console.log('sorted drchrono patients:', sortedPatientData);
        sortedPatientData.forEach((obj1, index1) => {
          // Check if there's a matching object in array2
          const matchingObj2 = rows.find((obj2) => obj1.id === obj2.ehr_id);

          // Log the values for debugging
          console.log('obj1.ehr_id:', obj1.ehr_id);
          console.log(
            'obj2.id:',
            matchingObj2 ? matchingObj2.id : 'No match found'
          );

          if (matchingObj2) {
            // If a match is found, set the corresponding index in updatedSuccessStates to true
            updatedSuccessStates[index1] = true;
            console.log('matched object:', matchingObj2);
          }
        });

        //const updatedSuccessStates = [...addSuccessStates];
        //updatedSuccessStates[index] = true;
        setPatientData(sortedPatientData);
        setAddSuccessStates(updatedSuccessStates);
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
    setPatientData([]);
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
  const handleAddPatient = async (patient, index) => {
    // You can perform the add action here using patient data
    console.log('Saving patient:', patient);

    // This disables the add button and prevents user from repetitively
    // clicking the add button while the post operation is in progress
    const updatedSavingStates = [...savingStates];
    updatedSavingStates[index] = true;
    setSavingStates(updatedSavingStates);

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

    if (patient['race']) {
      //const inputString = "blank,white,other";
      const arrayOfWords = patient['race'].split(',');

      // Use the filter method to remove the 'blank' element
      const filteredArray = arrayOfWords.filter(
        (word) => word.trim() !== 'blank'
      );

      // Use the join method to join the remaining elements with a comma
      const resultString = filteredArray.join(',');
      patient['race'] = resultString;
    }

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

    patient.practice_id = practiceId;
    patient.ehr_id = patient['id'];
    delete patient.id;

    if (patient['cell_phone']) {
      patient.cell_phone = patient['cell_phone'].replace(/\D/g, '');
    }

    try {
      console.log('Saving patient:', patient);
      const data = await postData('patients', patient);

      const updatedSuccessStates = [...addSuccessStates];
      updatedSuccessStates[index] = true;
      setAddSuccessStates(updatedSuccessStates);
    } catch (error) {
      console.error(error);
    } finally {
      const updatedSavingStates = [...savingStates];
      updatedSavingStates[index] = false;
      setSavingStates(updatedSavingStates);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg'>
      <DialogTitle className='dialogTitle'>
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
        {/* Close button */}
        <IconButton
          edge='end'
          color='inherit'
          onClick={onClose} // Call the onClose prop to close the dialog
          aria-label='close'
          sx={{
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            marginRight: '5px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className='dialogContent'>
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
            disabled={
              isSearching ||
              (!searchAttempted &&
                lastName === '' &&
                firstName === '' &&
                chartID === '')
            }
          >
            Search
          </Button>
          {/* Flashing "searching..." text */}
          {isSearching && (
            <span
              className='flashing-text'
              style={{
                color: colors.greenAccent[500], // Access the primary color from the theme
                marginLeft: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Searching...
            </span>
          )}
          {/* No data found message */}
          {searchAttempted && patientData.length === 0 && (
            <span
              style={{
                color: colors.redAccent[500],
                marginLeft: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              No patient found with the provided details
            </span>
          )}
          {/* Search returned more than 100 rows */}
          {searchAttempted && patientData.length > 100 && (
            <span
              style={{
                color: colors.redAccent[500], // Change this to any appropriate color from your theme
                marginLeft: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Too many results found --- narrow down your search
            </span>
          )}
          {/* Search returned number of rows */}
          {searchAttempted &&
            patientData.length > 0 &&
            patientData.length <= 100 && (
              <span
                style={{
                  color: colors.greenAccent[500],
                  marginLeft: '25px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {patientData.length}{' '}
                {patientData.length === 1 ? 'result' : 'results'} found
              </span>
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
                        backgroundColor: colors.primary[400],
                        marginRight: '0',
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
                        backgroundColor: colors.primary[400],
                        marginRight: '0',
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
                        backgroundColor: colors.primary[400],
                      },
                    }}
                  />
                  <Button
                    sx={{
                      backgroundColor: addSuccessStates[index]
                        ? colors.green
                        : colors.greenAccent[700],
                      color: colors.grey[100],
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginTop: '16px',
                      minWidth: '100px',
                      padding: '5px 10px',
                    }}
                    variant='contained'
                    onClick={() => handleAddPatient(patient, index)}
                    startIcon={addSuccessStates[index] && <CheckOutlinedIcon />}
                    disabled={savingStates[index] || addSuccessStates[index]}
                  >
                    {savingStates[index]
                      ? 'Adding...'
                      : addSuccessStates[index]
                      ? 'Added'
                      : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </DialogTitle>
    </Dialog>
  );
}

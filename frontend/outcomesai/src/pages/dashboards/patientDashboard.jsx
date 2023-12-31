import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography, useTheme, Accordion } from '@mui/material';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import MedicationSummaryCard from '../../components/MedicationSummeryCard';
import UserContext from '../../contexts/UserContext';
import { getData } from '../../utils/API';
import { calculateAge } from '../../utils/DateUtils';
import ShowAlert from '../../utils/ShowAlert';
import { useNotificationHandling } from '../../utils/NotificationHandling';

import EmailIcon from '@mui/icons-material/Email';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';

import StatBox from '../../components/StatBox';

const PatientDashboard = () => {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const location = useLocation();
  const theme = useTheme();
  const { practiceId } = useContext(UserContext);

  const colors = tokens(theme.palette.mode);
  const patient = location.state;
  const {
    notificationState,
    handleErrorNotification,
    handleInfoNotification,
    handleClose,
  } = useNotificationHandling();

  const [summaryByItem, setSummaryByItem] = useState([]);
  const [loading, setLoading] = useState(true);

  const fullName = `${patient.patient.first_name} ${patient.patient.last_name}`;
  let age = 0;
  if (patient.patient.birthdate) {
    age = calculateAge(patient.patient.birthdate);
  }

  const gender = patient.patient.gender_birth;
  let displayGender = 'Gender unknown';
  if (gender === 'M') {
    displayGender = 'Male';
  } else {
    displayGender = 'Female';
  }
  const race = patient.patient.race;
  let displayRace = 'Race unknown';
  if (race) {
    displayRace = race;
  }
  const ethnicity = patient.patient.ethnicity;
  let displayEthnicity = 'Ethnicity unknown';
  if (ethnicity && ethnicity !== 'blank') {
    displayEthnicity = ethnicity;
  }
  const email = patient.patient.email;
  let displayEmail = 'Ethnicity unknown';
  if (email && email !== 'blank') {
    displayEmail = email;
  }
  const cellPhone = patient.patient.cell_phone;
  let displayCellPhone = 'Ethnicity unknown';
  if (cellPhone && cellPhone !== 'blank') {
    displayCellPhone = cellPhone;
  }
  const city = patient.patient.city;
  let displayCity = 'Ethnicity unknown';
  if (city && city !== 'blank') {
    displayCity = city;
  }

  useEffect(() => {
    if (!practiceId || practiceId === '') {
      // Exit early if practiceId is empty or falsy
      return;
    }

    setLoading(true);

    const query_params = {
      practice_id: practiceId,
      practice_patient_id: patient.patient.id,
    };

    getData('patient_medications', query_params)
      .then((data) => {
        console.log('useEffect no error');
        const summaryByItem = data['summary_by_item'];

        console.log('summaryByItem:', summaryByItem);

        setSummaryByItem(summaryByItem);
      })
      .catch((error) => {
        console.log('useEffect error');
        console.log(error);
        if (error?.response?.data?.errorType === 'NoResultFound') {
          handleInfoNotification('No medication history found');
        } else {
          handleErrorNotification(error);
        }
      })
      .finally(() => {
        console.log('useEffect finally');
        setLoading(false);
      });
  }, [practiceId, patient.patient.id]);

  if (notificationState.showNotification) {
    return (
      <ShowAlert
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
        description={notificationState.description}
        onClose={handleClose}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or message
  }

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[800],
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: `2px solid ${colors.primary[500]}`,
  }));

  return (
    <Box m='20px' height='75%'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title={fullName} subtitle='Your Behaviorial Health' />
      </Box>
      <Box
        display='grid'
        gridTemplateColumns='70% 30%'
        gridAutoRows='300px'
        gap='0px'
      >
        <Box
          //backgroundColor={colors.primary[400]}
          sx={{
            padding: '0px',
          }}
        >
          {/* ROW 1 */}

          <Box
            gridColumn='span 1'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <StatBox title={age} subtitle='Years' />
            <StatBox title='2' subtitle='TMS Episodes' />
            <StatBox title='Remission' subtitle='Outcome' />
            <StatBox title='6 months' subtitle='Last Treated' />
          </Box>

          {/* Add more content as needed */}
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='flex-start'
          overflowY='auto'
          maxHeight='100vh'
        >
          {/* Accordion 1 */}
          <Accordion style={{ width: '100%' }}>
            <AccordionSummary
              aria-controls='panel1a-content'
              id='panel1a-header'
              sx={{ minHeight: '66px' }}
            >
              <Typography
                color={colors.grey[100]}
                variant='h5'
                fontWeight='600'
              >
                MEDICATION HISTORY
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
                {summaryByItem.map((item) => (
                  <MedicationSummaryCard
                    key={item.name}
                    title={item.name}
                    subtitle={item.signature_note}
                    gridRows={item.dispense_details}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Accordion 2 */}
          <Accordion style={{ width: '100%' }}>
            <AccordionSummary
              aria-controls='panel2a-content'
              id='panel2a-header'
              sx={{ minHeight: '66px' }}
            >
              <Typography
                color={colors.grey[100]}
                variant='h5'
                fontWeight='600'
              >
                APPOINTMENT HISTORY
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
                {summaryByItem.map((item) => (
                  <MedicationSummaryCard
                    key={item.name}
                    title={item.name}
                    subtitle={item.signature_note}
                    gridRows={item.dispense_details}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDashboard;

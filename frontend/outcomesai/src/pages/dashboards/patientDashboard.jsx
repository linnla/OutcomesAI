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
import ShowAlert from '../../utils/ShowAlert';
import { useNotificationHandling } from '../../utils/NotificationHandling';

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

  useEffect(() => {
    if (!practiceId || practiceId === '') {
      // Exit early if practiceId is empty or falsy
      return;
    }

    setLoading(true);

    const query_params = {
      practice_id: practiceId,
      patient_id: patient.patient.id,
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
        <Header title='PATIENT DASHBOARD' subtitle={fullName} />
      </Box>
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        {/* Accordion 1 */}
        <Accordion>
          <AccordionSummary aria-controls='panel1a-content' id='panel1a-header'>
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              MEDICATION HISTORY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ overflowY: 'scroll', maxHeight: '600px' }}>
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
        <Accordion>
          <AccordionSummary aria-controls='panel2a-content' id='panel2a-header'>
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              APPOINTMENT HISTORY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ overflowY: 'scroll', maxHeight: '600px' }}>
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
  );
};

export default PatientDashboard;

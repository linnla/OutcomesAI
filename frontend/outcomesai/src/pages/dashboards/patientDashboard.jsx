import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import MedicationDetailCard from '../../components/MedicationDetailCard';
import MedicationSummaryCard from '../../components/MedicationSummeryCard';
import UserContext from '../../contexts/UserContext';
import { getData } from '../../utils/API';
import ShowAlert from '../../utils/ShowAlert';
import { useNotificationHandling } from '../../utils/NotificationHandling';

const PatientDashboard = () => {
  const location = useLocation();
  const theme = useTheme();
  const { practiceId } = useContext(UserContext);

  const colors = tokens(theme.palette.mode);
  const patient = location.state;
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState([]);
  const [summaryByItem, setSummaryByItem] = useState([]);
  const [summaryByDate, setSummaryByDate] = useState([]);

  console.log(patient.patient.id);

  const fullName = `${patient.patient.first_name} ${patient.patient.last_name}`;

  //const sortByDateDescending = (a, b) => {
  //  const dateA = new Date(a.date_prescribed);
  //  const dateB = new Date(b.date_prescribed);
  //  return dateB - dateA;
  //};

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
        const detail = data['detail'];
        const summaryByItem = data['summary_by_item'];
        const summaryByDate = data['summary_by_date'];

        console.log('detail:', detail);
        console.log('summaryByItem:', summaryByItem);
        console.log('summaryByDate:', summaryByDate);

        setDetail(detail);
        setSummaryByItem(summaryByItem);
        setSummaryByDate(summaryByDate);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId]);

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

  return (
    <Box m='20px' height='75%'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title='PATIENT DASHBOARD' subtitle={fullName} />
      </Box>
      <Box>
        {/* Grid */}
        <Grid container spacing={2}>
          {/* Column 1 */}
          <Grid item xs={4}>
            <Paper elevation={3}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                borderBottom={`4px solid ${colors.primary[500]}`}
                backgroundColor={colors.primary[400]}
                colors={colors.grey[100]}
                p='15px'
              >
                <Typography
                  color={colors.grey[100]}
                  variant='h5'
                  fontWeight='600'
                >
                  MEDICATION HISTORY
                </Typography>
              </Box>
              <div style={{ overflowY: 'scroll', maxHeight: '600px' }}>
                {summaryByItem.map((item) => (
                  <MedicationSummaryCard
                    title={item.name} // Make sure to provide a unique key for each card
                    subtitle={item.signature_note}
                    gridRows={item.dispense_details}
                  />
                ))}
              </div>
            </Paper>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={4}>
            <Paper elevation={3}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                borderBottom={`4px solid ${colors.primary[500]}`}
                backgroundColor={colors.primary[400]}
                colors={colors.grey[100]}
                p='15px'
              >
                <Typography
                  color={colors.grey[100]}
                  variant='h5'
                  fontWeight='600'
                >
                  BY PRESCRIPTION DATE
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientDashboard;

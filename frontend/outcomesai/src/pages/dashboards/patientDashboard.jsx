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
  const {
    notificationState,
    handleErrorNotification,
    handleInfoNotification,
    handleClose,
  } = useNotificationHandling();

  const [detail, setDetail] = useState([]);
  const [summaryByItem, setSummaryByItem] = useState([]);
  const [summaryByDate, setSummaryByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientID, setPatientID] = useState(patient.patient.id);

  const fullName = `${patient.patient.first_name} ${patient.patient.last_name}`;
  console.log('patient:', fullName);
  console.log('patient_id:', patient.patient.id);

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
  }, [practiceId, patientID]);

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

  return (
    <Box m='20px' height='75%'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title='PATIENT DASHBOARD' subtitle={fullName} />
      </Box>
      <Box>
        {/* Grid */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {/*<Grid container columnSpacing={2}>*/}
          {/* Column 1 */}
          <Grid item xs={2} sm={4} md={4}>
            <Box
              // Box for grid column title
              backgroundColor={colors.primary[400]}
              display='flex'
              justifyContent='space-between'
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p='15px'
              gridAutoRows='300px'
            >
              <Typography
                color={colors.grey[100]}
                variant='h5'
                fontWeight='600'
                style={{
                  display: 'flex',
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                  height: '100%', // Make sure the box takes up the full height
                }}
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
          </Grid>

          {/* Column 2 */}
          <Grid item xs={4}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              backgroundColor={colors.primary[400]}
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p='15px'
            >
              <Typography
                color={colors.grey[100]}
                variant='h5'
                fontWeight='600'
              >
                APPOINTMENT HISTORY
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientDashboard;

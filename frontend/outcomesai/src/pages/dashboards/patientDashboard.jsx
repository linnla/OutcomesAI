import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PatientDashboard = () => {
  const location = useLocation();
  const patient = location.state;
  console.log(patient.patient.last_name);

  return (
    <div>
      <Typography variant='h4'>Patient Dashboard</Typography>
      <Typography variant='subtitle1'>patient</Typography>
      {/* Additional content for your page goes here */}
    </div>
  );
};

export default PatientDashboard;

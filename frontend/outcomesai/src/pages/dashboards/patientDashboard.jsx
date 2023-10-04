import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import OutlinedCard from '../../components/outlinedCard';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const PatientDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const patient = location.state;
  console.log(patient.patient.last_name);

  const fullName = `${patient.patient.first_name} ${patient.patient.last_name}`;

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
            <Paper
              //sx={{ backgroundColor: colors.primary[400], padding: '20px' }}
              elevation={3}
            >
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
                  MEDICATIONS
                </Typography>
              </Box>
              <OutlinedCard />
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
                  MEDICATIONS
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Column 3 */}
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
                  APPOINTMENTS
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

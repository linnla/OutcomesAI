import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import { mockMissingTestScores } from '../../data/mockData';
import { mockRecentlyCompletedTreament } from '../../data/mockData';
import { mockMissingTMSProtocols } from '../../data/mockData';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header';

const OutcomesDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataIsLoaded, setDataIsLoaded] = useState(false); // Initialize to false initially

  useEffect(() => {
    // Simulate loading your static data (replace this with your actual data loading logic)
    setTimeout(() => {
      setDataIsLoaded(true); // Set dataIsLoaded to true when your data is "loaded"
    }, 2000); // Simulate a 2-second delay
  }, []); // Run this effect only once on component mount

  return (
    <Box m='20px' height='75%'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title='OUTCOMES DASHBOARD' subtitle='Your Behaviorial Health' />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: '10px' }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridAutoRows='300px'
        gap='20px'
      >
        {/* ROW 1 */}
        {/***** 1 *****/}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          overflow='auto'
        >
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p='15px'
          >
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              Missing Test Scores
            </Typography>
          </Box>
          {mockMissingTestScores.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              borderBottom={`4px solid ${colors.primary[500]}`}
              p='15px'
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant='h5'
                  fontWeight='600'
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={
                  transaction.outcome === '2nd' || transaction.outcome === '3rd'
                    ? '#FFA500' // Set the background color to blue for 'Response'
                    : transaction.outcome === 'Baseline' ||
                      transaction.outcome === 'Final'
                    ? 'red' // Set the background color to yellow for 'No Response'
                    : 'green' // Set the background color to greenAccent[500] for other cases
                }
                width='100px' // Set a fixed width
                height='30px' // Set a fixed height
                borderRadius='4px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                p='5px 10px'
              >
                {transaction.outcome}
              </Box>
            </Box>
          ))}
        </Box>
        {/***** 2 *****/}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          overflow='auto'
        >
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p='15px'
          >
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              Missing TMS Protocols
            </Typography>
          </Box>
          {mockMissingTMSProtocols.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              borderBottom={`4px solid ${colors.primary[500]}`}
              p='15px'
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant='h5'
                  fontWeight='600'
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={
                  transaction.missing >= 20
                    ? 'red' // Set the background color to red for missing >= 20
                    : transaction.missing >= 10
                    ? '#FFA500' // Set the background color to orange for missing >= 10
                    : 'yellow' // Set the background color to dark yellow for other cases
                }
                width='100px' // Set a fixed width
                height='30px' // Set a fixed height
                borderRadius='4px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                p='5px 10px'
                color={transaction.missing >= 20 ? 'white' : 'black'} // Set text color based on background color
              >
                {transaction.missing}
              </Box>
            </Box>
          ))}
        </Box>
        {/***** 3 *****/}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          overflow='auto'
        >
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p='15px'
          >
            <Typography color={colors.grey[100]} variant='h5' fontWeight='600'>
              Recently Completed Treatment
            </Typography>
          </Box>
          {mockRecentlyCompletedTreament.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              borderBottom={`4px solid ${colors.primary[500]}`}
              p='15px'
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant='h5'
                  fontWeight='600'
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={
                  transaction.outcome === 'Response'
                    ? '#FFA500' // Set the background color to blue for 'Response'
                    : transaction.outcome === 'No Response'
                    ? 'red' // Set the background color to yellow for 'No Response'
                    : 'green' // Set the background color to greenAccent[500] for other cases
                }
                width='100px' // Set a fixed width
                height='30px' // Set a fixed height
                borderRadius='4px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                p='5px 10px'
              >
                {transaction.outcome}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OutcomesDashboard;

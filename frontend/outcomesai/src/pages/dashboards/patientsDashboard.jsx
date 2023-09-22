import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { mockTMSTransactions } from '../../data/mockData';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import Header from '../../components/Header';
import PatientsLineChart from '../../components/charts/PatientsLineChart';
import GeographyChart from '../../components/GeographyChart';
import BarChart from '../../components/BarChart';
import StatBox from '../../components/StatBox';
import ProgressCircle from '../../components/ProgressCircle';
import React from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const PatientsDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header
          title='TMS PATIENTS DASHBOARD'
          subtitle='Your Behaviorial Health'
        />

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

      <Box display='flex' alignItems='center'>
        {/* BOX 1 */}
        <Box flex='1 1 50%'>
          {/* HEADING - NEW PATIENTS */}
          <Typography
            variant='h4'
            fontWeight='600'
            color={colors.grey[100]}
            mt='20px'
            mb='10px'
            mr='20px' // Add some right margin for spacing
          >
            NEW PATIENTS
          </Typography>
        </Box>

        {/* BOX 2 */}
        <Box flex='1 1 50%'>
          {/* HEADING - RETURNING PATIENTS */}
          <Typography
            variant='h4'
            fontWeight='600'
            color={colors.grey[100]}
            mt='20px'
            mb='10px'
            ml='10px' // Add some left margin for spacing
          >
            RETURNING PATIENTS
          </Typography>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridAutoRows='140px'
        gap='20px'
      >
        {/* ROW 1 */}
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <StatBox
            title='15'
            subtitle='This Week'
            progress='0.75'
            increase='+14%'
            icon={
              <DateRangeOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <StatBox
            title='63'
            subtitle='This Month'
            progress='0.50'
            increase='+21%'
            icon={
              <CalendarMonthOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <StatBox
            title='76'
            subtitle='This Week'
            progress='0.30'
            increase='+5%'
            icon={
              <DateRangeOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>
        <Box
          gridColumn='span 3'
          backgroundColor={colors.primary[400]}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <StatBox
            title='225'
            subtitle='This Month'
            progress='0.80'
            increase='+43%'
            icon={
              <CalendarMonthOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn='span 8'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt='25px'
            p='0 30px'
            display='flex '
            justifyContent='space-between'
            alignItems='center'
          >
            <Box>
              <Typography
                variant='h5'
                fontWeight='600'
                color={colors.grey[100]}
              >
                Patients Treated
              </Typography>
              <Typography
                variant='h3'
                fontWeight='bold'
                color={colors.greenAccent[500]}
              >
                1,250
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: '26px', color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height='250px' m='-20px 0 0 0'>
            <PatientsLineChart isDashboard={true} />
          </Box>
        </Box>
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
          {mockTMSTransactions.map((transaction, i) => (
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

        {/* ROW 3 */}
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          p='30px'
        >
          <Typography variant='h5' fontWeight='600'>
            Outcomes
          </Typography>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            mt='25px'
          >
            <ProgressCircle size='175' />
            <Typography
              variant='h5'
              color={colors.greenAccent[500]}
              sx={{ mt: '15px' }}
            >
              Remission + Response
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant='h5'
            fontWeight='600'
            sx={{ padding: '30px 30px 0 30px' }}
          >
            Outcome By Office
          </Typography>
          <Box height='250px' mt='-20px'>
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn='span 4'
          gridRow='span 2'
          backgroundColor={colors.primary[400]}
          padding='30px'
        >
          <Typography
            variant='h5'
            fontWeight='600'
            sx={{ marginBottom: '15px' }}
          >
            Geography Based Traffic
          </Typography>
          <Box height='200px'>
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientsDashboard;

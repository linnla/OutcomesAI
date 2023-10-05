import React from 'react';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import { Typography, Box, useTheme } from '@mui/material';
//import Grid from '@mui/material/Grid'; // Import Grid component
import { tokens } from '../theme';
import MedicationGridRow from './MedicationGridRow'; // Import MedicationGridRow
import MedicationGridRowHeader from './MedicationGridRowHeader';

const MedicationSummaryCard = ({ title, subtitle, gridRows }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant='outlined'>
        <Paper
          sx={{
            backgroundColor: colors.primary[400],
            padding: '15px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          elevation={3}
        >
          {/* Title */}
          <Typography
            variant='h5'
            fontWeight='600'
            component='div'
            sx={{ color: colors.greenAccent[500], marginBottom: '1px' }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant='h6'
            component='div'
            sx={{ color: colors.grey[200], marginBottom: '10px' }}
          >
            {subtitle}
          </Typography>
          <MedicationGridRowHeader></MedicationGridRowHeader>
          {gridRows.map((row, index) => (
            <MedicationGridRow
              quantity={row.dispense_quantity}
              refills={row.number_refills}
              startDate={row.date_prescribed}
              stopDate={row.date_stopped_taking}
            />
          ))}
        </Paper>
      </Card>
    </Box>
  );
};

export default MedicationSummaryCard;

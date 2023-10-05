import React from 'react';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import { Typography, Box, useTheme, CardHeader } from '@mui/material';
import { tokens } from '../theme';
import MedicationGridRow from './MedicationGridRow';
import MedicationGridRowHeader from './MedicationGridRowHeader';

const MedicationSummaryCard = ({ title, subtitle, gridRows }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      backgroundColor={colors.primary[400]}
      sx={{
        minWidth: 275,
      }}
    >
      <Box
        borderBottom={`4px solid ${colors.primary[500]}`}
        sx={{
          padding: '15px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        <Typography
          variant='h5'
          fontWeight='600'
          component='div'
          sx={{ color: colors.greenAccent[400], marginBottom: '1px' }}
        >
          {title}
        </Typography>
        {/* Subtitle */}
        <Typography
          variant='h6'
          component='div'
          sx={{ color: colors.grey[100], marginBottom: '10px' }}
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
      </Box>
    </Box>
  );
};

export default MedicationSummaryCard;

import React from 'react';
import { Typography, useTheme, Box } from '@mui/material';
import { tokens } from '../theme';

const MedicationGridRowHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between', // Adjust spacing as needed
        marginBottom: '1px',
        color: colors.grey[200],
        width: '100%', // Fixed width for each row
        boxSizing: 'border-box', // Include padding and border in the width
      }}
    >
      <div style={{ flex: '1 0 20%', marginRight: '5px' }}>
        {/* Grid item 1 */}
        <Typography
          variant='h6'
          fontWeight='600'
          align='center'
          component='div'
          sx={{ color: colors.grey[100] }}
        >
          QTY
        </Typography>
      </div>

      <div style={{ flex: '1 0 20%', marginRight: '5px' }}>
        {/* Grid item 2 */}
        <Typography
          variant='h6'
          fontWeight='600'
          align='center'
          component='div'
          sx={{ color: colors.grey[100] }}
        >
          REFILLS
        </Typography>
      </div>

      <div style={{ flex: '1 0 30%', marginRight: '5px' }}>
        {/* Grid item 3 */}
        <Typography
          variant='h6'
          fontWeight='600'
          align='center'
          component='div'
          sx={{ color: colors.grey[100] }}
        >
          STARTED
        </Typography>
      </div>

      <div style={{ flex: '1 0 30%', marginRight: '5px' }}>
        {/* Grid item 4 */}
        <Typography
          variant='h6'
          fontWeight='600'
          align='center'
          component='div'
          sx={{ color: colors.grey[100] }}
        >
          STOPPED
        </Typography>
      </div>
    </div>
  );
};

export default MedicationGridRowHeader;

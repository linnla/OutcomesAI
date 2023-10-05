import React from 'react';
import { Typography, useTheme, Box } from '@mui/material';
import { tokens } from '../theme';

function formatDate(dateString) {
  // Check if dateString is null or empty
  if (dateString === null || dateString === '') {
    return '';
  }

  // Parse the date
  const date = new Date(dateString);

  // Check if the parsed date is invalid
  if (isNaN(date.getTime())) {
    return ''; // Return a space if the date is invalid
  }

  // Format the valid date
  const options = { year: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

const MedicationGridRow = ({ quantity, refills, startDate, stopDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const startedDate = formatDate(startDate);
  const stoppedDate = formatDate(stopDate);

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
      <div style={{ flex: '1 0 20%', marginRight: '1px' }}>
        {/* Grid item 1 */}
        <Typography
          variant='h5'
          align='center'
          component='div'
          sx={{ color: colors.grey[200] }}
        >
          {quantity}
        </Typography>
      </div>

      <div style={{ flex: '1 0 20%', marginRight: '5px' }}>
        {/* Grid item 2 */}
        <Typography
          variant='h5'
          align='center'
          component='div'
          sx={{ color: colors.grey[200] }}
        >
          {refills}
        </Typography>
      </div>

      <div style={{ flex: '1 0 30%', marginRight: '5px' }}>
        {/* Grid item 3 */}
        <Typography
          variant='h5'
          align='center'
          component='div'
          sx={{ color: colors.grey[200] }}
        >
          {startedDate}
        </Typography>
      </div>

      <div style={{ flex: '1 0 30%', marginRight: '5px' }}>
        {/* Grid item 4 */}
        <Typography
          variant='h5'
          align='center'
          component='div'
          sx={{ color: colors.grey[200] }}
        >
          {stoppedDate}
        </Typography>
      </div>
    </div>
  );
};

export default MedicationGridRow;

import React from 'react';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import { tokens } from '../theme';
import { Typography, Box, useTheme } from '@mui/material';

/* CALL IT LIKE THIS
<div style={{ overflowY: 'scroll', maxHeight: '600px' }}>
  {detail.map((item) => (
    <MedicationDetailCard
      key={item.id} // Make sure to provide a unique key for each card
      name={item.name}
      directions={item.signature_note}
      quantity={item.dispense_quantity}
      refills={item.number_refills}
      startDate={item.date_prescribed}
      stopDate={item.date_stopped_taking}
    />
  ))}
</div>;
*/

function formatDate(dateString) {
  //console.log('dateString:', dateString);

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

const MedicationDetailCard = ({
  name,
  directions,
  quantity,
  refills,
  startDate,
  stopDate,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const startedDate = formatDate(startDate);
  const stoppedDate = formatDate(stopDate);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant='outlined'>
        <Paper
          sx={{
            backgroundColor: colors.primary[400],
            padding: '15px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column', // Adjust to column layout
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
            {name}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant='h6'
            component='div'
            sx={{ color: colors.grey[200], marginBottom: '10px' }}
          >
            {directions}
          </Typography>

          {/* Grid */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>
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
              <Typography
                variant='h5'
                align='center'
                component='div'
                sx={{ color: colors.grey[200] }}
              >
                {quantity}
              </Typography>
            </div>

            <div style={{ flex: 1, marginRight: '10px' }}>
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
              <Typography
                variant='h5'
                align='center'
                component='div'
                sx={{ color: colors.grey[200] }}
              >
                {refills}
              </Typography>
            </div>

            <div style={{ flex: 1, marginRight: '10px' }}>
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
              <Typography
                variant='h5'
                align='center'
                component='div'
                sx={{ color: colors.grey[200] }}
              >
                {startedDate}
              </Typography>
            </div>

            <div style={{ flex: 1, marginRight: '10px' }}>
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
        </Paper>
      </Card>
    </Box>
  );
};

export default MedicationDetailCard;

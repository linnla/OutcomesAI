import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const formatDate = (dateString) => {
  const options = { year: '2-digit', month: 'short' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

const GridItem = ({ title, value, date }) => {
  return (
    <Grid item xs={6}>
      <Typography variant='body1' component='div'>
        <strong>{title}:</strong>
        {date ? ` ${formatDate(date)}` : ` ${value}`}
      </Typography>
    </Grid>
  );
};

export default GridItem;

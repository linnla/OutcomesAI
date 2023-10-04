import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button'; // Remove duplicate import
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';

const bull = (
  <Box
    component='span'
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const OutlinedCard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant='outlined'>
        <Paper
          sx={{ backgroundColor: colors.primary[400], padding: '20px' }}
          elevation={3}
        >
          <CardContent
            sx={{ backgroundColor: colors.primary[400], padding: '20px' }}
          >
            <Typography
              sx={{ fontSize: 14 }}
              color='text.secondary'
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant='h5' component='div'>
              be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              adjective
            </Typography>
            <Typography variant='body2'>
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>Learn More</Button>
          </CardActions>
        </Paper>
      </Card>
    </Box>
  );
};

export default OutlinedCard;

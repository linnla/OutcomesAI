import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';
import ProgressCircle from './ProgressCircle';

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      width='100%'
      //m='0 30px'
      display='flex'
      justifyContent='center'
      alignItems='center'
      backgroundColor={colors.primary[400]}
      sx={{
        border: '1px solid #000', // Add the border property to create an outline box
        borderRadius: '1px', // You can adjust the border radius to control the corner rounding
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '40px',
        paddingBottom: '40px',
      }}
    >
      <Box display='flex' flexDirection='column' alignItems='center'>
        {icon}
        <Typography
          variant='h3'
          fontWeight='bold'
          sx={{ color: colors.grey[100] }}
        >
          {title}
        </Typography>
        <Typography variant='h4' sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;

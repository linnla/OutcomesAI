import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Auth } from 'aws-amplify';

async function signOut() {
  console.log('Topbar signOut');
  try {
    await Auth.signOut();
    window.location.reload();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display='flex' justifyContent='flex-end' p={2}>
      {/* ICONS */}
      <Box display='flex'>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={signOut}>
          <PowerSettingsNewIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;

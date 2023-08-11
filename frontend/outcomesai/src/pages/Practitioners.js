import { Box } from '@mui/material';
import { tokens } from '../theme';
import { mockDataPractitioners } from '../data/mockData';
import Header from '../components/Header';
import { useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { DataGridPremium, GridToolbar } from '@mui/x-data-grid-premium';

const Practitioners = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndNavigate = async () => {
      const sessionValid = await verifySession();
      if (!sessionValid) {
        navigate('/login'); // Redirect to login page
      }
    };

    checkAndNavigate();
  }, [navigate]);

  const verifySession = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      console.log('User is authenticated');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  verifySession();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'user_id', headerName: 'User ID' },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'last_name',
      editable: true,
      headerName: 'Last Name',
      flex: 1,
    },
    {
      field: 'first_name',
      editable: true,
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'prefix',
      editable: true,
      headerName: 'Prefix',
      flex: 1,
    },
    {
      field: 'suffix',
      editable: true,
      headerName: 'Suffix',
      flex: 1,
    },
    {
      field: 'email',
      editable: true,
      headerName: 'Email',
      flex: 1,
    },
  ];

  return (
    <Box m='20px'>
      <Header title='PRACTITIONERS' subtitle='Manage Practitioners' />
      <Box m='40px 0 0 0' height='75vh'>
        <DataGridPremium
          rows={mockDataPractitioners}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Practitioners;

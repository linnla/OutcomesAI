import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../theme';
import { mockDataOffices } from '../data/mockData';
import Header from '../components/Header';
import { useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Offices = () => {
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
    console.log('Verify Session');
    try {
      const session = await Auth.currentSession();
      console.log(session);
      return true;
    } catch (error) {
      console.log('Error verifying session,', error);
      return false;
    }
  };

  verifySession();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'virtual',
      headerName: 'Telehealth',
      flex: 1,
    },
    {
      field: 'zip_code',
      headerName: 'Zip Code',
      flex: 1,
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
    },
    {
      field: 'state',
      headerName: 'State',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
  ];

  return (
    <Box m='20px'>
      <Header title='Offices' subtitle='Manage Offices' />
      <Box
        m='40px 0 0 0'
        height='75vh'
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockDataOffices}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Offices;
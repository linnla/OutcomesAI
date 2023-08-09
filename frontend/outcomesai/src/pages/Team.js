import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../components/Header';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { queryTable } from '../api/Api';
import ErrorModal from '../components/ErrorModal';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError(null); // Clear the error when modal is closed
  };

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
      const user = await Auth.currentAuthenticatedUser();
      const currentIdToken = user.signInUserSession.idToken.jwtToken;
      const savedIdToken = sessionStorage.getItem('idToken');
      if (currentIdToken !== savedIdToken) {
        console.log('Saving id token');
        sessionStorage.setItem('idToken', currentIdToken);
      }
      console.log('User is authenticated');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  verifySession();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    //const practice_id = sessionStorage.getItem('practice_id');
    const practice_id = 100106;

    try {
      const response = await queryTable('practice_users', {
        practice_id: practice_id,
      });
      console.log('non-error response.status', response.status);
      console.log('non-error response.data', response.data);
      setData(response.data.data);
    } catch (response) {
      console.log('error response', response);
      console.log('error response.response.data', response.response.data);
      if (response.response.data.message == 'The incoming token has expired') {
        const sessionValid = await verifySession();
        if (!sessionValid) {
          navigate('/login'); // Redirect to login page
        } else {
          fetchData();
        }
      } else {
        const errorObject = JSON.parse(response.response.data);
        if ('errorType' in errorObject) {
          setError({
            errorType: errorObject.errorType,
            errorDescription: errorObject.errorDescription,
            errorMessage: errorObject.errorMessage,
          });
          openModal();
        }
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      flex: 1,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'accessLevel',
      headerName: 'Access Level',
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width='60%'
            m='0 auto'
            p='15px'
            display='flex'
            justifyContent='center'
            backgroundColor={
              access === 'admin'
                ? colors.greenAccent[600]
                : access === 'manager'
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius='4px'
          >
            {access === 'admin' && <AdminPanelSettingsOutlinedIcon />}
            {access === 'manager' && <SecurityOutlinedIcon />}
            {access === 'user' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      {/* Render the modal when modalOpen is true */}
      {modalOpen && (
        <ErrorModal
          errorType={error.errorType}
          errorDescription={error.errorDescription}
          errorMessage={error.errorMessage}
          onClose={closeModal}
        />
      )}
      <Box m='20px'>
        <Header title='TEAM' subtitle='Managing the Team Members' />
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
          }}
        >
          <DataGrid checkboxSelection rows={data} columns={columns} />
        </Box>
      </Box>
    </div>
  );
};

export default Team;

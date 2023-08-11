import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import { queryTable } from '../api/Api';
import ErrorModal from '../components/ErrorModal';
import ErrorResponse from '../components/ErrorResponse';
import Authenticate from '../components/Authenticate';

const Offices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (errorType, errorDescription, errorMessage) => {
    setErrorType(errorType);
    setErrorMessage(errorMessage);
    setErrorDescription(errorDescription);
    setModalOpen(true);
  };

  const closeModal = () => {
    setErrorType(null);
    setErrorMessage(null);
    setErrorDescription(null);
    setModalOpen(false);
  };

  useEffect(() => {
    const checkAndNavigate = async () => {
      const sessionValid = await Authenticate();
      if (sessionValid) {
        fetchData();
        //fetchRoles();
      } else {
        navigate('/login');
      }
    };

    checkAndNavigate();
  }, [navigate]);

  const fetchData = async () => {
    const practice_id = sessionStorage.getItem('practice_id');
    try {
      const response = await queryTable('offices', {
        practice_id: practice_id,
      });
      setData(response.data.data);
      console.log(data);
    } catch (error) {
      ErrorResponse(error, openModal, navigate);
      console.log('errorMessage:', errorMessage);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await queryTable('roles');
      setRoles(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      ErrorResponse(error, openModal, navigate);
      console.log('errorMessage:', errorMessage);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'virtual',
      headerName: 'Telehealth',
      editable: true,
      type: 'boolean',
    },
    {
      field: 'postal_code',
      headerName: 'Zip Code',
      editable: true,
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
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
      flex: 1,
    },
  ];

  return (
    <CustomDataGrid
      data={data}
      columns={columns}
      title='Offices'
      subtitle='Manage Offices'
    />
  );
};

export default Offices;

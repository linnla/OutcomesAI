import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataGridEditable from '../../lib/DataGridEditable';
import { queryTable, updateRecord } from '../../api/Api';
import ErrorModal from '../../components/ErrorModal';
import ErrorResponse from '../../components/ErrorResponse';
import Authenticate from '../../components/Authenticate';

async function saveData(saveRow) {
  console.log('saveData:', saveRow);
  const result = updateRecord('offices', saveRow);
  return result;
}

async function validateData(newRow) {
  return await validatePostalCode(newRow.postal_code);
}

async function validatePostalCode(postal_code) {
  await queryTable('postal_codes', {
    postal_code: postal_code,
  })
    .then((response) => {
      return Promise.resolve(`postal code ${postal_code} is valid`);
    })
    .catch((error) => {
      return Promise.reject(`Invalid postal code ${postal_code}`);
    });
}

export const Offices = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleSubmit = async (saveRow) => {
    console.log('handleSubmit');
  };

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
      console.log('http Offices:', response);
      setData(response.data.data);
      //console.log('Offices fetchData:', data);
    } catch (error) {
      ErrorResponse(error, openModal, navigate);
      console.log('errorMessage:', errorMessage);
    }
  };

  const newRow = {
    name: '',
    virtual: false,
    postal_code: ' ',
    status: 'Active',
    isNew: true,
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
    <>
      {data.length > 0 ? (
        <DataGridEditable
          rowData={data}
          columnData={columns}
          title='Offices'
          subtitle='Manage Offices'
          newRow={newRow}
          handleSubmit={saveData}
          dataValidation={validateData}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
};

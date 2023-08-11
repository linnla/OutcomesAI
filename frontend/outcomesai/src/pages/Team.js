import { Box, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGridPremium,
  GridToolbar,
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid-premium';
import { tokens } from '../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../components/Header';
import React, { useEffect, useState } from 'react';
import { queryTable } from '../api/Api';
import ErrorModal from '../components/ErrorModal';
import ErrorResponse from '../components/ErrorResponse';
import Authenticate from '../components/Authenticate';
import { useNavigate } from 'react-router-dom';
import { updateRecord } from '../api/Api';

const Team = () => {
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
        fetchRoles();
      } else {
        navigate('/login');
      }
    };

    checkAndNavigate();
  }, [navigate]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const fetchData = async () => {
    const practice_id = sessionStorage.getItem('practice_id');
    try {
      const response = await queryTable('practice_users', {
        practice_id: practice_id,
      });
      setData(response.data.data);
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

  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [originalRowValues, setOriginalRowValues] = useState({});

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  function EditToolbar(props) {
    console.log('EditToolBar');
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const newId = Math.max(...data.map((row) => row.id)) + 1; // Generate a new unique ID
      const newRow = { id: newId, last_name: '', first_name: '', isNew: true };

      setData((prevData) => [...prevData, newRow]);
      setRows((prevRows) => [...prevRows, newRow]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'last_name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color='secondary' startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop = (params, event) => {
    console.log('handleRowEditStop');
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log('handleEditClick');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    const originalValues = { ...rows.find((row) => row.id === id) };
    setOriginalRowValues((prevValues) => ({
      ...prevValues,
      [id]: originalValues,
    }));
  };

  const updateDBRow = async (updatedRow) => {
    console.log('updateDBRow:', updatedRow);
    return;

    try {
      const newUser = {
        last_name: 'Linn',
        first_name: 'Laure',
      };

      const response = await updateRecord('users', newUser);
      if (response.status !== 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('Error creating user:', error);
      return false;
    }
  };

  // This function is called when the "Save" button is clicked
  const handleSaveClick = (id) => async () => {
    console.log('handleSaveClick');

    const updatedRow = rows.find((row) => row.id === id);
    const originalRow = originalRowValues[id];
    if (updatedRow != originalRow) {
      console.log('Changes Made');
      // Compare original values with new values to determine changes
      const changedFields = {};
      for (const field in updatedRow) {
        if (updatedRow[field] !== originalRow[field]) {
          changedFields[field] = updatedRow[field];
        }
      }
      console.log('changedFields:', changedFields);
    }

    try {
      // Perform API call to update the row in the database
      //await updateDBRow(updatedRow);

      // Update the rowModesModel to switch the mode back to view
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View },
      });
    } catch (error) {
      console.error('Error saving row:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleDeleteClick = (id) => () => {
    console.log('handleDeleteClick');
    setRows(rows.filter((row) => row.id !== id));
    console.log('delete', id);
  };

  const handleCancelClick = (id) => () => {
    console.log('handleCancelClick');
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    console.log('processRowUpdate newRow:', newRow);

    const updatedRow = { ...newRow, isNew: false };
    const originalRow = originalRowValues[newRow.id];
    if (updatedRow != originalRow) {
      console.log('Changes Made');
      // Compare original values with new values to determine changes
      const changedFields = {};
      for (const field in updatedRow) {
        if (updatedRow[field] !== originalRow[field]) {
          changedFields[field] = updatedRow[field];
        }
      }
      console.log('changedFields:', changedFields);
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    console.log('handleRowModeModelChange');
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'last_name',
      editable: true,
      headerName: 'Last Name',
      flex: 1,
      valueParser: (value) => value.toUpperCase(),
    },
    {
      field: 'first_name',
      editable: true,
      headerName: 'First Name',
      valueSetter: (value) => capitalizeWords(value),
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      editable: true,
      type: 'singleSelect',
      valueOptions: roles.map((role) => role.name),
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created',
      flex: 1,
    },
    {
      field: 'updated',
      headerName: 'Last Updated',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ];
      },
    },
  ];

  return (
    <div>
      {/* Render the modal when modalOpen is true */}
      {modalOpen && (
        <ErrorModal
          errorType={errorType}
          errorDescription={errorDescription}
          errorMessage={errorMessage}
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
          <DataGridPremium
            onProcessRowUpdateError={(error) => {
              // Handle the error here, for example:
              console.error('Error updating row:', error);
              // You can show an error message to the user or take other appropriate actions
            }}
            checkboxSelection
            rows={data}
            columns={columns}
            //slots={{
            //  toolbar: GridToolbar,
            //}}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Team;

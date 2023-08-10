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

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (errorType, errorDescription, errorMessage) => {
    setErrorType(errorType);
    setErrorMessage(errorMessage);
    setErrorDescription(errorDescription);
    setModalOpen(true);
    console.log('openModal errorType:', errorType);
    console.log('openModal errorDescription:', errorDescription);
    console.log('openModal errorMessage:', errorMessage);
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
      } else {
        navigate('/login');
      }
    };

    checkAndNavigate();
  }, [navigate]);

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

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = (id) => {
      setRows((oldRows) => [
        ...oldRows,
        { id, last_name: '', first_name: '', isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'last_name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log('save', id);
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    console.log('delete', id);
  };

  const handleCancelClick = (id) => () => {
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
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'fullName',
      headerName: 'Name',
      valueGetter: (params) => {
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`;
      },
    },
    {
      field: 'country',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['United Kingdom', 'Spain', 'Brazil'],
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
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'manager', 'user'],
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

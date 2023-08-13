import { Box } from '@mui/material';
import { tokens } from '../theme';
import Header from '../components/Header';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGridPremium,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridActionsCellItem,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const DataGridEditable = ({
  rowData,
  columnData,
  title,
  subtitle,
  newRow,
  handleSubmit,
  dataValidation,
}) => {
  //console.log('rowData', rowData);
  //console.log('columnData', columnData);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([rowData]);

  const [rowId, setRowId] = useState(null);

  const [rowModesModel, setRowModesModel] = useState({});
  const [pageSize, setPageSize] = useState(25);

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const apiRef = useGridApiRef();

  useEffect(() => {
    setRows(rowData);
  }, [rowData]);

  const appendedColumns = [
    ...columnData,
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

  function EditToolbar(props) {
    //console.log('CustomDataGrid EditToolBar props:', props);

    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      //console.log('CustomDataGrid handleClick');

      const newId = Math.max(...rows.map((row) => row.id)) + 1; // Generate a new unique ID
      console.log('newId:', newId);
      const addNewRow = { ...newRow, id: newId };

      setRows((prevRows) => [...prevRows, addNewRow]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
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

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow, oldRow) => {
    //async function processRowUpdate(newRow) {
    console.log('processRowUpdate:', newRow, oldRow);
    const updatedRow = { ...newRow, isNew: false };
    await dataValidation(newRow)
      .then(() => {
        console.log('data passed validation');
        handleSubmit(newRow)
          .then(() => {
            setSnackbar({
              children: 'Data saved',
              severity: 'success',
            });
            setRows(
              rows.map((row) => (row.id === newRow.id ? updatedRow : row))
            );
          })
          .catch((error) => {
            const errorData = error.response.data;
            const message = `${errorData.errorType}\n${errorData.errorMessage}\n${errorData.errorDescription}`;
            setSnackbar({
              children: message,
              severity: 'error',
            });
          });
      })
      .catch((error) => {
        setSnackbar({
          children: error,
          severity: 'error',
        });
      });
    return updatedRow;
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('handleProcessRowUpdateError:', error);
  }, []);

  return (
    <Box m='20px'>
      <Header title={title} subtitle={subtitle} />
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
        <DataGridPremium
          apiRef={apiRef}
          rows={rowData}
          columns={appendedColumns}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          rowsPerPageOptions={[5, 10, 25]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Box>
    </Box>
  );
};

export default DataGridEditable;

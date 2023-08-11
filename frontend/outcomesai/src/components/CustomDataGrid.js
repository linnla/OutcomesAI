import { Box } from '@mui/material';
import { tokens } from '../theme';
import { mockDataOffices } from '../data/mockData';
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
  GridToolbar,
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid-premium';
import React, { useEffect, useState } from 'react';

const CustomDataGrid = ({ rowData, columns, title, subtitle, newRow }) => {
  //console.log('rowData', rowData);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [originalRowValues, setOriginalRowValues] = useState({});

  useEffect(() => {
    setRows(rowData); // Update rows when rowData changes
    setOriginalRowValues(rowData);
  }, [rowData]); // Use rowData as a dependency

  function EditToolbar(props) {
    console.log('EditToolBar');

    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      console.log('handleClick');

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
    console.log('handleRowEditStop');
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log('handleEditClick');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    console.log('handleSaveClick');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    console.log('handleDeleteClick');
    setRows(rows.filter((row) => row.id !== id));
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
    console.log('processRowUpdate');
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    console.log('handleRowModesModelChange');
    setRowModesModel(newRowModesModel);
  };

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
          rows={rows}
          columns={columns}
          editMode='row'
          rowModesModel={rowModesModel}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          onRowModesModelChange={handleRowModesModelChange}
          onRowModesModelChangeError={(error) => {
            console.error('onRowModesModelChange Error:', error);
            // You can show an error message to the user or take other appropriate actions
          }}
          onRowEditStop={handleRowEditStop}
          onRowEditStopError={(error) => {
            console.error('onRowEditStop Error:', error);
            // You can show an error message to the user or take other appropriate actions
          }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('processRowUpdate Error:', error);
            // You can show an error message to the user or take other appropriate actions
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomDataGrid;

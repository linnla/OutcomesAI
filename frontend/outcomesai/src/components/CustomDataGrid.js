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

const CustomDataGrid = ({ data, columns, title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //const [data, setData] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [originalRowValues, setOriginalRowValues] = useState({});

  useEffect(() => {
    setRows(data);
  }, [data]);

  function EditToolbar(props) {
    console.log('EditToolBar');
    return;

    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const newId = Math.max(...data.map((row) => row.id)) + 1; // Generate a new unique ID
      const newRow = { id: newId, last_name: '', first_name: '', isNew: true };

      //setData((prevData) => [...prevData, newRow]);
      //setRows((prevRows) => [...prevRows, newRow]);

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
    return;

    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log('handleEditClick');
    return;

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    const originalValues = { ...rows.find((row) => row.id === id) };
    setOriginalRowValues((prevValues) => ({
      ...prevValues,
      [id]: originalValues,
    }));
  };

  // This function is called when the "Save" button is clicked
  const handleSaveClick = (id) => async () => {
    console.log('handleSaveClick');
    return;

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
    return;

    setRows(rows.filter((row) => row.id !== id));
    console.log('delete', id);
  };

  const handleCancelClick = (id) => () => {
    console.log('handleCancelClick');
    return;

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
    return;

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
    return;
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
          checkboxSelection
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            // Handle the error here, for example:
            console.error('Error updating row:', error);
            // You can show an error message to the user or take other appropriate actions
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomDataGrid;

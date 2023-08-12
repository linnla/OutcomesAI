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
  GridToolbar,
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  gridClasses,
} from '@mui/x-data-grid-premium';
import React, { useEffect, useState } from 'react';

const CustomDataGrid = ({ rowData, columnData, title, subtitle, newRow }) => {
  //console.log('rowData', rowData);
  //console.log('columnData', columnData);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([rowData]);
  const [columns, setColumns] = useState([columnData]);

  const [rowId, setRowId] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [pageSize, setPageSize] = useState(25);

  const actionFields = {
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
  };

  useEffect(() => {
    setRows(rowData);
  }, [rowData]);

  useEffect(() => {
    setColumns(columnData);
    columns.push(actionFields);
    console.log('useEffect columns:', columns);
    console.log('useEffect columnData:', columnData);
  }, [columnData, actionFields]);

  function EditToolbar(props) {
    console.log('CustomDataGrid EditToolBar props:', props);

    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      console.log('CustomDataGrid handleClick');

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
    console.log('CustomDataGrid handleRowEditStop');
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log('CustomDataGrid handleEditClick');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    console.log('CustomDataGrid handleSaveClick');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    console.log('CustomDataGrid handleDeleteClick');
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    console.log('CustomDataGrid handleCancelClick');
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
    console.log('CustomDataGrid processRowUpdate');

    //handleSubmit();

    const updatedRow = { ...newRow, isNew: false };
    console.log('updatedRow:', updatedRow);
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
        {/*console.log('Calling DataGridPremium with rowData', rowData)*/}
        {/*console.log('Calling DataGridPremium with columnData', columnData)*/}
        <DataGridPremium
          rows={rowData}
          columns={columnData}
          editMode='row'
          rowModesModel={rowModesModel}
          rowsPerPageOptions={[5, 10, 25]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onCellEditCommit={(params) => setRowId(params.id)}
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

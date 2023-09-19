// translate to javascript and custom it by Blueberry 03/02/2023
import * as React from 'react';
import { Box } from '@mui/material';
import { tokens } from '../../../theme';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGridPremium,
  GridRowModes,
  GridActionsCellItem,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

import DefaultToolbar from './DefaultToolbar';
import { useEffect, useState } from 'react';
import ErrorModal from '../../../utils/ErrorModal';

function DataGridOld({
  title,
  subtitle,
  columns,
  rows,
  defaultPageSize,
  onValidateRow,
  onSaveRow,
  onDeleteRow,
  createRowData,
  ...props
}) {
  console.log('OneToManyDataGrid:', rows);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const apiRef = useGridApiRef();
  const [internalRows, setInternalRows] = useState(rows);
  const [rowModesModel, setRowModesModel] = useState({});

  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    setInternalRows(rows);
  }, [rows]);

  const handleRowEditStart = (params, event) => {
    //console.log('handleRowEditStart params', params);
    //console.log('handleRowEditStart event', event);
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    //console.log('handleRowEditStop params', params.field);
    //console.log('handleRowEditStop event', event);
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    //console.log('handleEditClick', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    //console.log('handleSaveClick', id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = async (id) => {
    //console.log('handleDeleteClick', id);
    const row = internalRows.find((r) => r.id === id);

    try {
      const deleteResponse = await onDeleteRow(id, row, internalRows);
      if (deleteResponse === 'Deleted') {
        setInternalRows(internalRows.filter((row) => row.id !== id));
      }
      //console.log('handleDeleteClick delete response', deleteResponse);
    } catch (error) {
      console.error('handleDeleteClick error', error);
      setErrorType('Delete Error');
      setErrorMessage(error || 'Unknown error');
      setShowErrorModal(true);
    }
  };

  const handleCancelClick = (id) => () => {
    //console.log('handleCancelClick', id);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = internalRows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setInternalRows(internalRows.filter((row) => row.id !== id));
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.error('handleProcessRowUpdateError:', error);
    setErrorType('Data Error');
    setErrorMessage(error || 'Unknown error');
    setShowErrorModal(true);
  }, []);

  const processRowUpdate = async (newRow) => {
    //console.log('processRowUpdate newRow', newRow);
    const updatedRow = { ...newRow };
    if (!updatedRow.isNew) updatedRow.isNew = false;
    const oldRow = internalRows.find((r) => r.id === updatedRow.id);

    // If its not a new row and it hasn't changed, don't save the row
    if (updatedRow.isNew === false) {
      if (deepEqual(newRow, oldRow)) {
        console.log('processRowUpdate no changes made');
        // This return statement is required or else datagrid will throw an internal error
        // Cannot read properties of undefined (reading 'id') at getRowIdFromRowModel
        return oldRow;
      }
    }

    //console.log('updatedRow', updatedRow);
    try {
      const validatedRow = await onValidateRow(updatedRow, oldRow);
      const savedRow = await onSaveRow(
        validatedRow.id,
        validatedRow,
        oldRow,
        internalRows
      );
      // This return statement is required or else datagrid will throw an internal error
      // Cannot read properties of undefined (reading 'id') at getRowIdFromRowModel
      return savedRow;
    } catch (error) {
      console.error('processRowUpdate', error);
      apiRef.current.updateRows([{ id: updatedRow.id, ...oldRow }]);
      throw error;
    }
  };

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true; // If they're the same object or both primitives
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return false; // One is an object, the other isn't
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false; // Different number of properties
    }

    for (const key in obj1) {
      if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  const appendedColumns = [
    ...columns,
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
            onClick={() => handleDeleteClick(id)}
            color='inherit'
          />,
        ];
      },
    },
  ];

  //pagination
  const [pageSize, setPageSize] = useState(defaultPageSize);
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
          rows={internalRows}
          columns={appendedColumns}
          editMode='row'
          apiRef={apiRef}
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          slots={{
            toolbar: DefaultToolbar,
          }}
          slotProps={{
            toolbar: {
              rows: internalRows,
              setRows: setInternalRows,
              setRowModesModel,
              createRowData,
              columns,
            },
          }}
          experimentalFeatures={{ newEditingApi: true }}
          //pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          {...props}
        />
        {showErrorModal && (
          <ErrorModal
            errorType={errorType}
            errorMessage={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </Box>
    </Box>
  );
}

DataGrid2.defaultProps = {
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
      },
    },
  },
  autoHeight: true,

  //pagination
  pagination: true,
  defaultPageSize: 25,
  rowsPerPageOptions: [5, 10, 25, 50, 100],
};

export default DataGrid2;

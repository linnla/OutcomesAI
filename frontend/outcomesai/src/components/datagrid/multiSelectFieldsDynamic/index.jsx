// This grid takes an array of fields that get displayed at the top.
// The field options have no filtering capabilities.

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { tokens } from '../../../theme';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGridPremium,
  GridActionsCellItem,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

import DefaultToolbar from './DefaultToolbar';
import ErrorModal from '../../../utils/ErrorModal';

// Custom hook for handling dynamic fields' state
function useDynamicFieldsState(fields) {
  const initialState = {};
  fields.forEach((field) => {
    initialState[field.attribute] = '';
  });
  const [fieldStates, setFieldStates] = useState(initialState);

  // Handle change for a specific field
  const handleFieldChange = (fieldAttribute, value) => {
    setFieldStates((prevFieldStates) => ({
      ...prevFieldStates,
      [fieldAttribute]: value,
    }));
  };

  // Reset all field values
  const resetFieldStates = () => {
    setFieldStates(initialState);
  };

  return [fieldStates, handleFieldChange, resetFieldStates];
}

function MultiSelectFieldsDynamic({
  title,
  subtitle,
  columns,
  rows,
  defaultPageSize,
  fields,
  onValidateRow,
  onSaveRow,
  onDeleteRow,
  ...props
}) {
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

  // Custom hook to manage dynamic fields' state
  const [fieldStates, handleFieldChange, resetFieldStates] =
    useDynamicFieldsState(fields);

  const handleClick = async () => {
    const newRow = {};
    // Populate newRow object with selected values from fieldStates
    fields.forEach((field) => {
      newRow[field.attribute] = fieldStates[field.attribute];
    });

    try {
      const validatedRow = await onValidateRow(newRow, internalRows);
      console.log('ValidatedRow:', validatedRow);
      await onSaveRow(validatedRow);

      setInternalRows((rows) => [...rows, validatedRow]);
      resetFieldStates(); // Reset field values after successful save
    } catch (error) {
      setErrorType('Data Error');
      setErrorMessage(error || 'Unknown error');
      setShowErrorModal(true);
    }
  };

  const handleDeleteClick = async (id) => {
    console.log('handleDeleteClick', id);
    const row = internalRows.find((r) => r.id === id);

    try {
      const deleteResponse = await onDeleteRow(id, row, internalRows);
      if (deleteResponse === 'Deleted') {
        setInternalRows(internalRows.filter((row) => row.id !== id));
      }
    } catch (error) {
      console.error('handleDeleteClick error', error);
      setErrorType('Delete Error');
      setErrorMessage(error || 'Unknown error');
      setShowErrorModal(true);
    }
  };

  const appendedColumns = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
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

  // Pagination
  const [pageSize, setPageSize] = useState(defaultPageSize);

  return (
    <Box m='20px'>
      <Header title={title} subtitle={subtitle} />

      {/* Multi-select data fields */}
      <Box display='flex' gap='20px' my='20px'>
        {fields.map((field, index) => (
          <FormControl
            key={field.label}
            variant='outlined'
            style={{ flex: `1 0 calc(30% - 10px)` }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldStates[field.attribute] || '#####'}
              onChange={(event) =>
                handleFieldChange(field.attribute, event.target.value)
              }
              label={field.label}
              disabled={index > 0 && !fieldStates[fields[index - 1].attribute]}
            >
              <MenuItem value='' disabled>
                <em>Select {field.label}</em>
              </MenuItem>
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Button
          color='secondary'
          startIcon={<AddIcon />}
          onClick={handleClick}
          style={{ flex: '0 0 auto' }}
        >
          Add record
        </Button>
      </Box>

      <Box m='20px'></Box>
      <Box
        m='40px 0 0 0'
        height='75vh'
        sx={{
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-cell': { borderBottom: 'none' },
          '& .name-column--cell': { color: colors.greenAccent[300] },
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
          slots={{ toolbar: DefaultToolbar }}
          slotProps={{
            toolbar: {
              rows: internalRows,
              setRows: setInternalRows,
              setRowModesModel,
              columns,
            },
          }}
          experimentalFeatures={{ newEditingApi: true }}
          // Pagination
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

MultiSelectFieldsDynamic.defaultProps = {
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
      },
    },
  },
  autoHeight: true,

  // Pagination
  pagination: true,
  defaultPageSize: 25,
  rowsPerPageOptions: [5, 10, 25, 50, 100],
};

export default MultiSelectFieldsDynamic;

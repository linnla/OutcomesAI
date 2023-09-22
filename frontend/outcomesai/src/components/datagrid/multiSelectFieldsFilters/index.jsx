// translate to javascript and custom it by Blueberry 03/02/2023

// This grid shows three multi-select fields at the top and field 3 option
// values are dependant on value users select in field 2.

import * as React from 'react';
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
import { useEffect, useState } from 'react';
import ErrorModal from '../../../utils/ErrorModal';

function MultiSelectFieldsFilters({
  title,
  subtitle,
  columns,
  rows,
  defaultPageSize,
  field1Label,
  field1Objects,
  field1ValueAttribute,
  attribute1,
  field2Label,
  field2Objects,
  field2ValueAttribute,
  attribute2,
  matchAttribute,
  field3Label,
  field3Objects,
  field3ValueAttribute,
  attribute3,
  onValidateRow,
  onSaveRow,
  onDeleteRow,
  ...props
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States for the multi-select fields
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');

  const [field1Options, setField1Options] = useState(['']);
  const [field2Options, setField2Options] = useState(['']);
  const [field3Options, setField3Options] = useState(['']);

  const apiRef = useGridApiRef();
  const [internalRows, setInternalRows] = useState(rows);
  const [rowModesModel, setRowModesModel] = useState({});

  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    setInternalRows(rows);
  }, [rows]);

  useEffect(() => {
    const names = field1Objects
      .map((item) => item[field1ValueAttribute])
      .sort();
    setField1Options(names);
  }, [field1Objects, field1ValueAttribute]);

  useEffect(() => {
    const names = field2Objects
      .map((item) => item[field2ValueAttribute])
      .sort();
    setField2Options(names);
  }, [field2Objects, field2ValueAttribute]);

  useEffect(() => {
    const names = field3Objects
      .map((item) => item[field3ValueAttribute])
      .sort();
    setField3Options(names);
  }, [field3Objects, field3ValueAttribute]);

  const handleClick = async () => {
    let row = {};
    row[attribute1] = field1;
    row[attribute2] = field2;
    row[attribute3] = field3;

    try {
      const validatedRow = await onValidateRow(row, rows);
      await onSaveRow(validatedRow);
      setInternalRows((rows) => {
        return [...rows, validatedRow];
      });
    } catch (error) {
      setErrorType('Data Error');
      setErrorMessage(error || 'Unknown error');
      setShowErrorModal(true);
    } finally {
      setField1('');
      setField2('');
      setField3('');
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

  //pagination
  const [pageSize, setPageSize] = useState(defaultPageSize);
  return (
    <Box m='20px'>
      <Header title={title} subtitle={subtitle} />

      {/* Single-select data fields */}
      <Box display='flex' gap='20px' my='20px'>
        <FormControl
          variant='outlined'
          style={{ flex: '1 0 calc(30% - 10px)' }}
        >
          <InputLabel>{field1Label}</InputLabel>
          <Select
            value={field1}
            onChange={(event) => setField1(event.target.value)}
            label={field1Label}
          >
            <MenuItem value='' disabled>
              <em>Select {field1Label}</em>
            </MenuItem>
            {field1Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant='outlined'
          style={{ flex: '1 0 calc(30% - 10px)' }}
        >
          <InputLabel>{field2Label}</InputLabel>
          <Select
            value={field2}
            onChange={(event) => {
              const selectedValue = event.target.value;
              setField2(selectedValue);
              const matchedItem = field2Objects.find(
                (item) => item.name === selectedValue
              );

              // Field 3 values presented are dependent on value selected in Field 2
              if (matchedItem) {
                const matchValue = matchedItem[matchAttribute];
                const matchedItems = field3Objects.filter(
                  (item) => item[matchValue] === matchValue
                );
                const matchedNames = matchedItems.map((option) => option.name);
                setField3Options(matchedNames);
              }
            }}
            label={field2Label}
          >
            <MenuItem value='' disabled>
              <em>Select {field2Label}</em>
            </MenuItem>
            {field2Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant='outlined'
          style={{ flex: '1 0 calc(30% - 10px)' }}
        >
          <InputLabel>{field3Label}</InputLabel>
          <Select
            value={field3}
            onChange={(event) => setField3(event.target.value)}
            label={field3Label}
            disabled={!field2}
          >
            <MenuItem value='' disabled>
              <em>Select {field3Label}</em>
            </MenuItem>
            {field3Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

MultiSelectFieldsFilters.defaultProps = {
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

export default MultiSelectFieldsFilters;

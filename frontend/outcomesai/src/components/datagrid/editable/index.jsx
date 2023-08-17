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

function EditableDataGrid({
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const apiRef = useGridApiRef();
  const [internalRows, setInternalRows] = useState(rows);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    setInternalRows(rows);
  }, [rows]);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setInternalRows(internalRows.filter((row) => row.id !== id));
    onDeleteRow(
      id,
      internalRows.find((row) => row.id === id),
      internalRows
    );
  };

  const handleCancelClick = (id) => () => {
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
    console.log('handleProcessRowUpdateError:', error);
  }, []);

  const processRowUpdate = async (newRow) => {
    console.log('processRowUpdate newRow:', newRow);
    const updatedRow = { ...newRow };
    if (!updatedRow.isNew) updatedRow.isNew = false;
    console.log('updatedRow.isNew:', updatedRow.isNew);
    const oldRow = internalRows.find((r) => r.id === updatedRow.id);
    setInternalRows(
      internalRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    let savedRow = {};
    try {
      await onValidateRow(updatedRow);
      savedRow = await onSaveRow(
        updatedRow.id,
        updatedRow,
        oldRow,
        internalRows,
        updatedRow.isNew
      );
      apiRef.current.updateRows([{ id: newRow.id, ...savedRow }]);
    } catch (error) {
      console.error('processRowUpdate', error.message);
    }

    return updatedRow;
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
      </Box>
    </Box>
  );
}

EditableDataGrid.defaultProps = {
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

export default EditableDataGrid;

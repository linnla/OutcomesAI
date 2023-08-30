// translate to javascript and custom it by Blueberry 03/02/2023
import { Box } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { tokens } from '../../../theme';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import React from 'react';

import DefaultToolbar from './DefaultToolbar';
import { useEffect, useState } from 'react';

function ReadOnlyDataGrid({
  title,
  subtitle,
  columns,
  rows,
  defaultPageSize,
  ...props
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [internalRows, setInternalRows] = useState(rows);

  useEffect(() => {
    setInternalRows(rows);
  }, [rows]);

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
          columns={columns}
          slots={{
            toolbar: DefaultToolbar,
          }}
          slotProps={{
            toolbar: {
              columns,
            },
          }}
          //pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          {...props}
        />
      </Box>
    </Box>
  );
}

ReadOnlyDataGrid.defaultProps = {
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

export default ReadOnlyDataGrid;

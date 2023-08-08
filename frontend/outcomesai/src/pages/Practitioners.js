import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../theme';
import { mockDataPractitioners } from '../data/mockData';
import Header from '../components/Header';
import { useTheme } from '@mui/material';

const Practitioners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'user_id', headerName: 'User ID' },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
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
      field: 'prefix',
      editable: true,
      headerName: 'Prefix',
      flex: 1,
    },
    {
      field: 'suffix',
      editable: true,
      headerName: 'Suffix',
      flex: 1,
    },
    {
      field: 'email',
      editable: true,
      headerName: 'Email',
      flex: 1,
    },
  ];

  return (
    <Box m='20px'>
      <Header title='PRACTITIONERS' subtitle='Manage Practitioners' />
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
        <DataGrid
          rows={mockDataPractitioners}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Practitioners;

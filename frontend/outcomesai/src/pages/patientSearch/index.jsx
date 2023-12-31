// This grid is read-only mode only.

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import React from 'react';
import DefaultToolbar from './DefaultToolbar.jsx';
import { tokens } from '../../theme';
import { parseUTCDate, formatDateToMMDDYYYY } from '../../utils/DateUtils';
import { getData } from '../../utils/API';
import UserContext from '../../contexts/UserContext';
import ShowAlert from '../../utils/ShowAlert';
import { useNotificationHandling } from '../../utils/NotificationHandling';

function PatientSearch({ defaultPageSize, ...props }) {
  const { practiceId } = useContext(UserContext);
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const ehrIntegration = true;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const title = 'Patients';
  let subtitle = `Search ${title}`;
  const table = 'practice_patients';
  const sort_1 = 'last_name';
  const sort_2 = 'first_name';

  const [rows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(true);
  //pagination
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const setRows = (rows) => {
    if (!Array.isArray(rows)) {
      console.error('setRows received non-array data:', rows);
      return;
    }
    setRawRows(rows.map((r, i) => ({ ...r, no: i + 1 })));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await getData('practice_patients', {
        practice_id: practiceId,
      });
      const sortedItems = sortItems(data, sort_1, sort_2);
      setRows(sortedItems);
    } catch (error) {
      handleErrorNotification(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!practiceId || practiceId === '') {
      // Exit early if practiceId is empty or falsy
      return;
    }

    setLoading(true);
    getData(table, { practice_id: practiceId })
      .then((data) => {
        const sortedItems = sortItems(data, sort_1, sort_2);
        setRows(sortedItems);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId, handleErrorNotification]);

  function sortItems(items, sort_attribute_1, sort_attribute_2) {
    return items.sort((a, b) => {
      // Primary criterion: sort_attribute_1
      const comparison_1 = a[sort_attribute_1].localeCompare(
        b[sort_attribute_1]
      );

      // If the primary criteria are the same and sort_attribute_2 is provided, sort by sort_attribute_2
      if (comparison_1 === 0 && sort_attribute_2) {
        return a[sort_attribute_2].localeCompare(b[sort_attribute_2]); // Secondary criterion
      }

      return comparison_1;
    });
  }

  // Handle row click
  const handleRowClick = (params) => {
    const currentRow = params.row;
    navigate('/dashboard/patient', { state: { patient: currentRow } });
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'last_name',
      headerName: 'Last',
      cellClassName: 'name-column--cell',
      flex: 0.5,
    },
    {
      field: 'first_name',
      headerName: 'First',
      cellClassName: 'name-column--cell',
      flex: 0.5,
    },
    {
      field: 'chart_id',
      headerName: 'Chart ID',
      cellClassName: 'name-column--cell',
      headerAlign: 'left',
      align: 'left',
      flex: 0.5,
    },
    {
      field: 'birthdate',
      type: 'date',
      headerName: 'Birth Date',
      headerAlign: 'left',
      align: 'left',
      flex: 0.5,
      valueGetter: (params) => new Date(params.row.birthdate),
      renderCell: (params) => {
        if (params.value) {
          // If it's already a Date object, use it directly
          if (params.value instanceof Date) {
            return <Box>{formatDateToMMDDYYYY(params.value)}</Box>;
          }

          // If it's a string, try to parse it using our function
          if (typeof params.value === 'string') {
            const date = parseUTCDate(params.value); // This is the function we defined previously
            return <Box>{formatDateToMMDDYYYY(date)}</Box>;
          }
        }

        return <Box></Box>; // Default empty box if no valid date was found
      },
    },
    {
      field: 'gender_birth',
      headerName: 'Birth Gender',
      headerAlign: 'center',
      align: 'center',
      flex: 0.33,
    },
    {
      field: 'email',
      headerName: 'Email',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'city',
      headerName: 'City',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
    },
  ];

  if (notificationState.showNotification) {
    return (
      <ShowAlert
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
        description={notificationState.description}
        onClose={handleClose}
      />
    );
  }

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
          onRowClick={handleRowClick}
          loading={loading}
          slots={{
            toolbar: ehrIntegration ? DefaultToolbar : undefined, // Conditionally render DefaultToolbar
          }}
          slotProps={{
            toolbar: {
              columns,
              rows,
              refreshData: refreshData,
              ehrIntegration, // Pass ehrIntegration as a prop to DefaultToolbar
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

PatientSearch.defaultProps = {
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

export default PatientSearch;

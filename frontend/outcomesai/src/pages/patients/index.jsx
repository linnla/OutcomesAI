import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import { validateRow, saveRow, deleteRow } from './PatientController';
import UserContext from '../../contexts/UserContext';
import PatientContext from '../../contexts/PatientContext';

export default function PatientManageGrid() {
  const { role, practiceId } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  const { patients, fetchAll } = useContext(PatientContext);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setRows(patients);
  }, [patients]);

  const onValidateRow = (newRow, oldRow, isNew) => {
    return new Promise((resolve, reject) => {
      validateRow(newRow, oldRow, isNew)
        .then((updatedRow) => {
          resolve(updatedRow); // Resolve with the updatedRow
        })
        .catch((error) => {
          console.error('onValidateRow error:', error);
          reject(error); // Reject with the validateRow error
        });
    });
  };

  const onSaveRow = (id, updatedRow, oldRow, oldRows, isNew) => {
    return new Promise((resolve, reject) => {
      let newRow = {};
      if (isNew) {
        newRow = { ...updatedRow, practice_id: practiceId };
        delete newRow.id;
      } else {
        newRow = { ...updatedRow };
      }

      saveRow(newRow, oldRow, isNew)
        .then((res) => {
          const dbRow = res;
          setRows(
            oldRows.map((r) => (r.id === updatedRow.id ? { ...dbRow } : r))
          );

          fetchAll();
          resolve(dbRow);
        })
        .catch((error) => {
          console.error('onSaveRow error', error);
          setRows(oldRows);
          reject(error); // Reject with saveRow error
        });
    });
  };

  const onDeleteRow = (id, oldRow, oldRows) => {
    return new Promise((resolve, reject) => {
      deleteRow(id, oldRows)
        .then((res) => {
          const dbRowId = res.data.id;
          setRows(oldRows.filter((r) => r.id !== dbRowId));
          fetchAll();
          resolve(); // Resolve on successful deletion
        })
        .catch((error) => {
          console.error('onDeleteRow error', error);
          setRows(oldRows);
          reject(error); // Reject on error
        });
    });
  };

  if (role === 'user') {
    return (
      <div>
        <ReadOnlyDataGrid
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
        />
      </div>
    );
  }

  if (role === 'manager' || role === 'admin') {
    return (
      <div>
        <EditableDataGrid
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          onValidateRow={onValidateRow}
          onSaveRow={onSaveRow}
          onDeleteRow={onDeleteRow}
          createRowData={createRowData}
          //loading={loading}
        />
      </div>
    );
  }
}

// Customize this data
const title = 'Patients';
const subtitle = 'Manage Patients';

const createRowData = (rows) => {
  // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
  const newId = Math.floor(100000 + Math.random() * 900000);
  return {
    id: newId,
    last_name: '',
    first_name: '',
    email: '',
    birthdate: '',
    gender: '',
  };
};

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'last_name',
    headerName: 'Last',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'first_name',
    headerName: 'First',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'email',
    headerName: 'First',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'birthdate',
    type: 'date',
    headerName: 'Birth Date',
    headerAlign: 'center',
    align: 'center',
    valueGetter: (params) => new Date(params.row.birthdate),
    renderCell: (params) => {
      return <Box>{params.value ? params.value.toLocaleDateString() : ''}</Box>;
    },
    editable: true,
    flex: 1,
  },
  {
    field: 'gender',
    headerName: 'Birth Gender',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    type: 'singleSelect',
    valueOptions: ['M', 'F'],
    flex: 1,
  },
  {
    field: 'postal_code',
    headerName: 'Zip Code',
    headerAlign: 'center',
    align: 'center',
    editable: true,
    flex: 1,
  },
  {
    field: 'city',
    headerName: 'City',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
  },
  {
    field: 'state',
    headerName: 'State',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
  },
];

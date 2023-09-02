import * as React from 'react';
import { useEffect, useState } from 'react';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import { getAll, validateRow, saveRow, deleteRow } from './OfficeController';

export default function OfficeManageGrid() {
  const [rows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  useEffect(() => {
    setLoading(true);

    const fetchRowData = async () => {
      try {
        const response = await getAll();
        setRows(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]); // Set rows to an empty array if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchRowData();
  }, []);

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
      const newRow = { ...updatedRow };
      if (isNew) {
        delete newRow.id;
      }

      saveRow(newRow, oldRow, isNew)
        .then((res) => {
          const dbRow = res;
          setRows(
            oldRows.map((r) => (r.id === updatedRow.id ? { ...dbRow } : r))
          );

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
          loading={loading}
        />
      </div>
    );
  }
}

// Customize this data
const title = 'Offices';
const subtitle = 'Manage Offices';
const role = 'manager';

const createRowData = (rows) => {
  console.log(rows);

  const newId = Math.floor(100000 + Math.random() * 900000);
  return { id: newId, name: '', status: 'Active', virtual: false };
};

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'name',
    headerName: 'Name',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
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
    field: 'virtual',
    headerName: 'Telehealth',
    editable: true,
    type: 'boolean',
    defaultValueGetter: () => false,
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
  {
    field: 'created',
    headerName: 'Created',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    type: 'singleSelect',
    valueOptions: ['Active', 'Inactive'],
    defaultValueGetter: () => 'Active',
    flex: 1,
  },
];

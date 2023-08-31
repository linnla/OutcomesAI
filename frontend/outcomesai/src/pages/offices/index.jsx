import * as React from 'react';
import { useEffect, useState } from 'react';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import ErrorModal from '../../utils/ErrorModal';
import { getAll, validateRow, saveRow, deleteRow } from './OfficeController';

export default function OfficeManageGrid() {
  const [rows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const title = 'Offices';
  const subtitle = 'Manage Offices';
  const role = 'manager';
  const table = 'Office'; /// used for error messages

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
        .then((result) => {
          resolve(result); // Resolve with the updatedRow
        })
        .catch((error) => {
          console.error('onValidateRow error:', error);
          setErrorType('Data Error');
          setErrorDescription(
            `An error occured while validating ${table} data`
          );
          setErrorMessage(error || 'Unknown error');
          setShowErrorModal(true);
          reject(error); // Reject with the validation error
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

          if (
            error.message ===
            'DatabaseError: Unique Constraint Error or Duplicate Key Violation. The record being inserted or updated already exists.'
          ) {
            setErrorType('Data Error');
            setErrorMessage(`An ${table} with this name already exists`);
            setShowErrorModal(true);
          } else if (
            // Postal code lookup error's, postal code not found
            error.message ===
            'DatabaseError: A database result was required but none was found'
          ) {
            setErrorType('Data Error');
            setErrorMessage(error.message || 'Unknown error');
            setShowErrorModal(true);
          } else {
            setErrorType('Save Error');
            setErrorDescription(`An error occured while saving ${table} data`);
            setErrorMessage(error.message || 'Unknown error');
            setShowErrorModal(true);
          }

          setRows(oldRows);
          reject(error);
        });
    });
  };

  const onDeleteRow = (id, oldRow, oldRows) => {
    deleteRow(id, oldRows)
      .then((res) => {
        const dbRowId = res.data.id;
        setRows(oldRows.filter((r) => r.id !== dbRowId));
      })
      .catch((error) => {
        console.error(error);
        setRows(oldRows);
      });
  };

  const createRowData = (rows) => {
    console.log(rows);

    const newId = Math.floor(100000 + Math.random() * 900000);
    return { id: newId, name: '', status: 'Active', virtual: false };
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
        {showErrorModal && (
          <ErrorModal
            errorType={errorType}
            errorDescription={errorDescription}
            errorMessage={errorMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    );
  }
}

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

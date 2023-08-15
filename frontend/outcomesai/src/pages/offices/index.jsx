import * as React from 'react';
import { useEffect, useState } from 'react';
import FullEditDataGrid from '../../components/datagrid/crud';
import officeController from './OfficeController';
import ErrorModal from '../../utils/ErrorModal';

export default function OfficeManageGrid() {
  const [rows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await officeController.getAll(false);
        console.log('Response from getAll():', response);
        setRows(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]); // Set rows to an empty array if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onValidateRow = (updatedRow) => {
    officeController
      .validateRow(updatedRow)
      .then((res) => {
        return true;
      })
      .catch((error) => {
        console.log('onValidateRow error', error);
        setErrorType('Data Error');
        setErrorDescription('An error occurred while validating office data');
        setErrorMessage(error.message || 'Unknown error');
        setShowErrorModal(true);
      });
  };

  const onSaveRow = (id, updatedRow, oldRow, oldRows, isNew) => {
    const saveRow = { ...updatedRow };
    if (isNew) {
      delete saveRow.id;
    }

    officeController
      .saveRow(saveRow, oldRow, isNew)
      .then((res) => {
        const dbRow = res;
        console.log('index.jsx saveRow res:', res);
        setRows(
          oldRows.map((r) => (r.id === updatedRow.id ? { ...dbRow } : r))
        );
      })
      .catch((error) => {
        console.log('onSaveRow error', error);

        if (
          error.message ===
          'DatabaseError: Unique Constraint Error or Duplicate Key Violation. The record being inserted or updated already exists.'
        ) {
          setErrorType('Data Error');
          setErrorMessage('An office with this name already exists');
          setShowErrorModal(true);
        } else {
          setErrorType('Save Error');
          setErrorDescription('An error occurred while saving office data');
          setErrorMessage(error.message || 'Unknown error');
          setShowErrorModal(true);
        }
        setRows(oldRows);
      });
  };

  const onDeleteRow = (id, oldRow, oldRows) => {
    officeController
      .deleteRow(id, oldRows)
      .then((res) => {
        const dbRowId = res.data.id;
        setRows(oldRows.filter((r) => r.id !== dbRowId));
      })
      .catch((err) => {
        setRows(oldRows);
      });
  };

  const createRowData = (rows) => {
    console.log(rows);

    const newId = Math.floor(100000 + Math.random() * 900000);
    return { id: newId, name: '', status: 'Active', virtual: false };
  };

  return (
    <div>
      <FullEditDataGrid
        title='Offices'
        subtitle='Manage Offices'
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

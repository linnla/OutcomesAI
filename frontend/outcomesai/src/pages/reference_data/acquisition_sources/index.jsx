import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import EditableDataGrid from '../../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../../components/datagrid/readonly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE **************
export default function AcquisitionSourcesGrid() {
  const title = 'Medication Sources';
  const table = 'acquisition_sources';
  // *************** CUSTOMIZE **************
  const { role } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete, Inactivate';
  }

  const requiredAttributes = ['name', 'description', 'status'];
  const attributeNames = ['Name', 'Description', 'Status'];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      cellClassName: 'name-column--cell',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'left',
      align: 'left',
      editable: true,
      cellClassName: 'wrapText',
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
      width: 100,
    },
  ];

  useEffect(() => {
    setLoading(true);
    getData(table)
      .then((data) => {
        //console.log('data:', data);
        setRows(data);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, table);
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

  const createRowData = (rows) => {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      name: '',
      description: '',
      status: 'Active',
    };
  };
  // *************** CUSTOMIZE ************** END

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      if (row.isNew) {
        const rowToSave = { ...row };
        // Delete the id that was generated when row was created
        delete rowToSave.id;
        const data = await postData(table, rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));
        return rowToSave;
      } else {
        await putData(table, row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);
      const errorMessage = createErrorMessage(error, row.name);
      throw errorMessage;
    }
  }

  async function deleteRow(id, row, oldRows) {
    const body = {
      id: row.id,
    };

    try {
      await deleteData(table, body);
      setRows(oldRows.filter((r) => r.id !== id));
      return 'Deleted';
    } catch (error) {
      setRows(oldRows);
      const errorMessage = createErrorMessage(error, row.name);
      throw errorMessage;
    }
  }

  if (showErrorModal) {
    return (
      <ErrorModal
        errorType={errorType}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    );
  }

  if (role === 'super') {
    return (
      <div>
        <EditableDataGrid
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          onValidateRow={validateRow}
          onSaveRow={saveRow}
          onDeleteRow={deleteRow}
          createRowData={createRowData}
          loading={loading}
        />
      </div>
    );
  } else {
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
}

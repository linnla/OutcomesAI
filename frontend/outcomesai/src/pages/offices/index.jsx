import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import UserContext from '../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../utils/API';
import {
  validatePostalCodeFormat,
  validatePostalCodeExists,
  validateRequiredAttributes,
} from '../../utils/ValidationUtils';
import { createErrorMessage } from '../../utils/CreateErrorMessage';
import ErrorModal from '../../utils/ErrorModal';

export default function OfficeManageGrid() {
  const { role, practiceId } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  useEffect(() => {
    getData(table, { practice_id: practiceId })
      .then((data) => {
        setRows(data);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, table);
        setErrorType('Data Fetch Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      });
  }, [practiceId]);

  // *************** CUSTOMIZE ************** START
  const title = 'Offices';
  const subtitle = 'Manage Offices';
  const table = 'offices';
  const requiredAttributes = ['name', 'postal_code'];
  const attributeNames = ['Office name', 'Postal Code'];

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      validatePostalCodeFormat(newRow.postal_code);
      const postalCodeInfo = await validatePostalCodeExists(newRow.postal_code);
      const updatedRow = { ...newRow, ...postalCodeInfo };
      return updatedRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

  function createRowData(rows) {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      name: '',
      status: 'Active',
      virtual: false,
    };
  }
  // *************** CUSTOMIZE ************** END

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      if (row.isNew) {
        // *************** CUSTOMIZE ************** START
        const rowToSave = { ...row, practice_id: practiceId };
        // *************** CUSTOMIZE ************** END

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

      // *************** CUSTOMIZE ************** START
      const errorMessage = createErrorMessage(error, row.name);
      // *************** CUSTOMIZE ************** END

      throw errorMessage;
    }
  }

  async function deleteRow(id, row, oldRows) {
    // *************** CUSTOMIZE ************** START
    const body = {
      practice_id: row.practice_id,
      id: row.id,
    };
    // *************** CUSTOMIZE ************** END

    try {
      await deleteData(table, body);
      setRows(oldRows.filter((r) => r.id !== id));
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE ************** START
      const errorMessage = createErrorMessage(error, row.name);
      // *************** CUSTOMIZE ************** END

      throw errorMessage;
    }
  }

  /*
  function processError(error, data) {
    console.log('processError error', error);
    console.log('processError data', data);

    // Default error message
    let errorMessage = 'Unknown Error';

    // Handling Axios-like error responses
    if (error?.response?.data) {
      if (error.response.data.errorType === 'DuplicateKeyError') {
        errorMessage = `${data} already exists`;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.errorMessage) {
        if (
          error.response.data.errorMessage ===
          'A database result was required but none was found'
        ) {
          errorMessage = `No ${data} found`;
        } else {
          errorMessage = error.response.data.errorMessage;
        }
      } else if (error.response.data.status) {
        const statusCode = error.response.data.status;
        if (statusCode >= 500) {
          errorMessage = 'Error accessing database or server';
        }
      }
    }
    // Handling local JavaScript Error objects
    else if (error.message) {
      errorMessage = error.message;
    }

    return errorMessage;
  };
  */

  if (showErrorModal) {
    return (
      <ErrorModal
        errorType={errorType}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    );
  }

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
          onValidateRow={validateRow}
          onSaveRow={saveRow}
          onDeleteRow={deleteRow}
          createRowData={createRowData}
          //loading={loading}
        />
      </div>
    );
  }
}

// *************** CUSTOMIZE ************** START
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
// *************** CUSTOMIZE ************** END

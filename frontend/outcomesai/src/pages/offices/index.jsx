import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import UserContext from '../../contexts/UserContext';
import ShowDatabaseError from '../../utils/ErrorModal';
import {
  getOne,
  getData,
  postData,
  putData,
  deleteData,
} from '../../utils/API';
import {
  validatePostalCode,
  validateRequiredAttributes,
} from '../../utils/ValidationUtils';

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
    getData('offices', { practice_id: practiceId })
      .then((data) => {
        console.log('Data:', data);
        setRows(data);
      })
      .catch((error) => {
        const databaseErrorMessage =
          error?.response?.data?.errorMessage || 'Unknown error';

        const status = error?.response?.data?.status;

        const getErrorMessage = (message, status) => {
          switch (message) {
            case 'A database result was required but none was found':
              return 'No Offices found for your Practice';
            case 'Query parameters required: id or practice_id':
              return 'Invalid request, practice is a required parameter';
            default:
              return status >= 500 ? 'Error accessing database' : message;
          }
        };

        const errorMessage = getErrorMessage(databaseErrorMessage, status);
        console.error('Error message:', databaseErrorMessage);

        setErrorType('Data Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      });
  }, [practiceId]);

  const validateRow = async (newRow) => {
    const requiredAttributes = ['name', 'postal_code'];
    const attributeNames = ['Office name', 'Postal Code'];

    try {
      await validateRequiredAttributes(
        requiredAttributes,
        attributeNames,
        newRow
      );
      await validatePostalCode(newRow.postal_code);
      const postalCodeInfo = await getPostalCodeInfo(newRow.postal_code);
      const updatedRow = { ...newRow, ...postalCodeInfo };
      //console.log('updatedRow', updatedRow);
      return updatedRow;
    } catch (error) {
      console.error(error);
      setErrorType('Data Validation Error');
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  };

  const getPostalCodeInfo = async (postalCode) => {
    try {
      const data = await getOne('postal_codes', { postal_code: postalCode });
      return data;
    } catch (error) {
      const databaseErrorMessage =
        error?.response?.data?.errorMessage || 'Unknown error';
      const status = error?.response?.data?.status;

      const getErrorMessage = (message, status) => {
        switch (message) {
          case 'A database result was required but none was found':
            return 'Postal code not found';
          default:
            return status >= 500 ? 'Error accessing database' : message;
        }
      };

      const errorMessage = getErrorMessage(databaseErrorMessage, status);
      throw new Error(errorMessage); // Corrected this line
    }
  };

  const saveRow = async (id, row, oldRow, oldRows) => {
    try {
      if (row.isNew) {
        const rowToSave = { ...row, practice_id: practiceId };
        // Delete the id that was generated when row was created
        delete rowToSave.id;
        const data = await postData('offices', rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));
        return rowToSave;
      } else {
        const data = await putData('offices', row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);
      const databaseErrorType =
        error?.response?.data?.errorType || 'Unknown errorType';
      const databaseErrorMessage =
        error?.response?.data?.errorMessage || 'Unknown error';
      const status = error?.response?.data?.status;

      const getErrorMessage = (errorType, status) => {
        switch (errorType) {
          case 'DuplicateKeyError':
            return 'This office already exists';
          default:
            return status >= 500
              ? 'Error accessing database'
              : databaseErrorMessage;
        }
      };

      const errorMessage = getErrorMessage(databaseErrorType, status);
      throw new Error(errorMessage);
    }
  };

  const deleteRow = async (id, row, oldRows) => {
    console.log('deleteRow id', id);
    console.log('deleteRow row', row);

    const body = {
      practice_id: row.practice_id,
      id: row.id,
    };

    try {
      const data = await deleteData('offices', body);
      setRows(oldRows.filter((r) => r.id !== id));
    } catch (error) {
      console.error('deleteRow', error);
      setRows(oldRows);

      let errorMessage = 'Unknown Error';
      if (error?.response?.data?.errorType) {
        console.log('errorType exists:', error.response.data.errorType);
        errorMessage = error.response.data.errorMessage;
      } else if (error?.response?.data?.message) {
        console.log('message exists', error.response.data.message);
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.status) {
        const statusCode = error.response.data.status;
        if (statusCode >= 500) {
          errorMessage = 'Error accessing database or server';
        }
      }
      throw new Error(errorMessage);
    }
  };

  if (showErrorModal) {
    return (
      <ShowDatabaseError
        errorType={errorType}
        errorMessage={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    );
  }

  console.log('office: role', role);
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

// Customize this data
const title = 'Offices';
const subtitle = 'Manage Offices';

const createRowData = (rows) => {
  // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
  const newId = Math.floor(100000 + Math.random() * 900000);
  return {
    id: newId,
    name: '',
    status: 'Active',
    virtual: false,
  };
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

import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import UserContext from '../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../utils/API';
import {
  validatePostalCodeFormat,
  validatePostalCodeExists,
  validateRequiredAttributes,
  validateDateObject,
  validateEmail,
} from '../../utils/ValidationUtils';
import { parseUTCDate, formatDateToMMDDYYYY } from '../../utils/DateUtils';

import { createErrorMessage } from '../../utils/ErrorMessage';
import ErrorModal from '../../utils/ErrorModal';

export default function PatientManageGrid() {
  const { role, practiceId } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  useEffect(() => {
    setLoading(true);
    getData(getTable, { practice_id: practiceId })
      .then((data) => {
        setRows(data);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, getTable);
        setErrorType('Data Fetch Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId]);

  // *************** CUSTOMIZE ************** START
  const title = 'Patients';
  const subtitle = 'Manage Patients';
  const saveTable = 'patients';
  const getTable = 'practice_patients';
  const requiredAttributes = [
    'last_name',
    'first_name',
    'email',
    'postal_code',
    'gender',
    'birthdate',
  ];
  const attributeNames = [
    'Last Name',
    'First Name',
    'Email',
    'Postal Code',
    'Birth Gender',
    'Birth Date',
  ];

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      validateEmail(newRow.email);
      validateDateObject(newRow.birthdate);
      validatePostalCodeFormat(newRow.postal_code);
      const postalCodeInfo = await validatePostalCodeExists(newRow.postal_code);
      const updatedRow = { ...newRow, ...postalCodeInfo };
      return updatedRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, saveTable);
      throw errorMessage;
    }
  }

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
      status: 'Active',
    };
  };
  // *************** CUSTOMIZE ************** END

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      // *************** CUSTOMIZE ************** START
      // Convert the birthdate to the desired format
      const dateString = row.birthdate.toISOString().slice(0, 10);

      // Update the row object with the dateString
      row.birthdate = dateString;
      // *************** CUSTOMIZE ************** END

      if (row.isNew) {
        // *************** CUSTOMIZE ************** START
        const rowToSave = { ...row, practice_id: practiceId };
        // *************** CUSTOMIZE ************** END

        // Delete the id that was generated when row was created
        delete rowToSave.id;
        const data = await postData(saveTable, rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));

        // *************** CUSTOMIZE ************** START
        rowToSave.status = 'Active';
        // Create one-to-many row
        const practicePatient = {
          practice_id: rowToSave.practice_id,
          patient_id: rowToSave.id,
        };
        await postData(getTable, practicePatient);
        // *************** CUSTOMIZE ************** END

        return rowToSave;
      } else {
        await putData(saveTable, row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE ************** START
      let fullName = `${row.first_name} ${row.last_name}`;
      const errorMessage = createErrorMessage(error, fullName);
      // *************** CUSTOMIZE ************** END

      throw errorMessage;
    }
  }

  async function inActivateRow(id, row, oldRows) {
    try {
      const practicePatient = {
        practice_id: row.practice_id,
        patient_id: row.id,
        status: 'Inactive',
      };
      await putData(getTable, practicePatient);
      row.status = 'Inactive';
      setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
      return 'Inactive';
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE ************** START
      let fullName = `${row.first_name} ${row.last_name}`;
      const errorMessage = createErrorMessage(error, fullName);
      // *************** CUSTOMIZE ************** END

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
          onDeleteRow={inActivateRow}
          createRowData={createRowData}
          loading={loading}
        />
      </div>
    );
  }
}

// *************** CUSTOMIZE ************** START

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'last_name',
    headerName: 'Last',
    editable: true,
    cellClassName: 'name-column--cell',
    flex: 1,
  },
  {
    field: 'first_name',
    headerName: 'First',
    editable: true,
    cellClassName: 'name-column--cell',
    flex: 1,
  },
  {
    field: 'birthdate',
    type: 'date',
    headerName: 'Birth Date',
    flex: 1,
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
    editable: true,
  },
  {
    field: 'gender',
    headerName: 'Birth Gender',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    type: 'singleSelect',
    valueOptions: ['M', 'F'],
  },
  {
    field: 'email',
    headerName: 'Email',
    headerAlign: 'center',
    align: 'center',
    editable: true,
    flex: 1,
  },
  {
    field: 'postal_code',
    headerName: 'Zip Code',
    headerAlign: 'center',
    align: 'center',
    editable: true,
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
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    type: 'singleSelect',
    valueOptions: ['Active', 'Inactive'],
  },
];
// *************** CUSTOMIZE ************** END

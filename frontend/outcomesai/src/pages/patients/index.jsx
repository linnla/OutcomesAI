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

// *************** CUSTOMIZE ************** START

export default function PatientGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Patients';
  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete, Inactivate';
  }
  const table = 'patients';
  const relatedTable = 'practice_patients';
  const sort_1 = 'last_name';
  const sort_2 = 'first_name';

  const requiredAttributes = [
    'last_name',
    'first_name',
    'email',
    'postal_code',
    'gender',
    'birthdate',
    'status',
  ];
  const attributeNames = [
    'Last Name',
    'First Name',
    'Email',
    'Postal Code',
    'Birth Gender',
    'Birth Date',
    'Status',
  ];

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

  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const setRows = (rows) => {
    if (!Array.isArray(rows)) {
      console.error('setRows received non-array data:', rows);
      return;
    }
    console.log('setRows:', rows);
    setRawRows(rows.map((r, i) => ({ ...r, no: i + 1 })));
  };

  function sortItems(items, sort_attribute_1, sort_attribute_2) {
    return items.sort((a, b) => {
      const comparison_1 = a[sort_attribute_1].localeCompare(
        b[sort_attribute_1]
      );

      if (comparison_1 === 0 && sort_attribute_2) {
        return a[sort_attribute_2].localeCompare(b[sort_attribute_2]); // Secondary criterion
      }

      return comparison_1;
    });
  }

  useEffect(() => {
    setLoading(true);
    getData(relatedTable, { practice_id: practiceId })
      .then((data) => {
        //console.log('data:', data);
        const sortedItems = sortItems(data, sort_1, sort_2);
        console.log(sortedItems);
        setRows(sortedItems);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, relatedTable);
        setErrorType('Data Fetch Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId]);

  async function validateRow(newRow, oldRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      validateEmail(newRow.email);
      validateDateObject(newRow.birthdate);
      validatePostalCodeFormat(newRow.postal_code);
      const postalCodeInfo = await validatePostalCodeExists(newRow.postal_code);
      const updatedRow = { ...newRow, ...postalCodeInfo };
      return updatedRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      // Convert the birthdate to the desired format
      const dateString = row.birthdate.toISOString().slice(0, 10);
      row.birthdate = dateString;

      if (row.isNew) {
        const rowToSave = { ...row, practice_id: practiceId };
        delete rowToSave.id;
        const data = await postData(table, rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));

        // Create row in the related table
        rowToSave.status = 'Active';
        const relatedRow = {
          practice_id: rowToSave.practice_id,
          patient_id: rowToSave.id,
        };
        await postData(relatedTable, relatedRow);
        return rowToSave;
      } else {
        await putData(table, row);
        if (row.status !== oldRow.status) {
          const relatedRow = {
            practice_id: row.practice_id,
            patient_id: row.id,
            status: row.status,
          };
          await putData(relatedTable, relatedRow);
        }
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE **************
      let fullName = `${row.first_name} ${row.last_name}`;
      const errorMessage = createErrorMessage(error, fullName);
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

      const relatedRow = {
        practice_id: row.practice_id,
        patient_id: row.id,
      };
      await deleteData(relatedTable, relatedRow);
      return row;
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE **************
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

  if (role === 'manager' || role === 'admin' || role === 'super') {
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

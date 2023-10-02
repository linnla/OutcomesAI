import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import ViewOnly from '../../../components/datagrid/viewOnly';
import DataEntry from '../../../components/datagrid/dataEntry';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import {
  validatePostalCodeFormat,
  validatePostalCodeExists,
  validateRequiredAttributes,
  validateDateObject,
  validateEmail,
} from '../../../utils/ValidationUtils';
import { parseUTCDate, formatDateToMMDDYYYY } from '../../../utils/DateUtils';
import ErrorAlert from '../../../utils/ErrorAlert';
import { useErrorHandling } from '../../../utils/ErrorHandling';

// *************** CUSTOMIZE ************** START

export default function PatientsGrid() {
  const { role, practiceId } = useContext(UserContext);
  const { errorState, handleError, handleClose } = useErrorHandling();

  const title = 'Patients';
  let subtitle = `View ${title}`;
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const table = 'patients';
  const relatedTable = 'practice_patients';
  const sort_1 = 'last_name';
  const sort_2 = 'first_name';
  const requiredAttributes = [
    'last_name',
    'first_name',
    'birthdate',
    'postal_code',
    'status',
  ];
  const attributeNames = [
    'Last Name',
    'First Name',
    'Birth Date',
    'Postal Code',
    'Status',
  ];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'last_name',
      headerName: 'Last',
      editable: true,
      cellClassName: 'name-column--cell',
      flex: 0.5,
    },
    {
      field: 'first_name',
      headerName: 'First',
      editable: true,
      cellClassName: 'name-column--cell',
      flex: 0.5,
    },
    {
      field: 'ehr_id',
      headerName: 'EHR ID',
      editable: true,
      flex: 0.5,
    },
    {
      field: 'chart_id',
      headerName: 'Chart ID',
      editable: true,
      flex: 0.5,
    },
    {
      field: 'birthdate',
      type: 'date',
      headerName: 'Birth Date',
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
      editable: true,
    },
    {
      field: 'gender_birth',
      headerName: 'Birth Gender',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      type: 'singleSelect',
      valueOptions: ['M', 'F', ''],
      flex: 0.5,
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
      flex: 0.5,
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
      flex: 0.5,
    },
  ];

  const createRowData = (rows) => {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      last_name: '',
      first_name: '',
      ehr_id: '',
      chart_id: '',
      email: '',
      birthdate: '',
      gender_birth: '',
      postal_code: '',
      status: 'Active',
    };
  };
  // *************** CUSTOMIZE ************** END

  const [loading, setLoading] = useState(true);
  const [rows, setRawRows] = useState([]);

  const setRows = (rows) => {
    if (!Array.isArray(rows)) {
      console.error('setRows received non-array data:', rows);
      return;
    }
    setRawRows(rows.map((r, i) => ({ ...r, no: i + 1 })));
  };

  useEffect(() => {
    setLoading(true);
    getData(relatedTable, { practice_id: practiceId })
      .then((data) => {
        const sortedItems = sortItems(data, sort_1, sort_2);
        setRows(sortedItems);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId, handleError]);

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
      throw error;
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
        return rowToSave;
      } else {
        await putData(table, row);
        return row;
      }
    } catch (error) {
      setRows(oldRows);
      throw error;
    }
  }

  async function episodesOfCareExists(row) {
    try {
      await getData('episodes_of_care', {
        practice_id: practiceId,
        patient_id: row.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function deleteRow(id, row, oldRows) {
    // Need to create an error object for this condition
    const episodeExists = await episodesOfCareExists(row);
    if (episodeExists) {
      let fullName = `${row.first_name} ${row.last_name}`;
      const customError = new Error();
      customError.name = 'Delete Error';
      customError.message = `${fullName} has an episode of care and cannot be deleted.`;
      customError.stack = 'Set the status to Inactive to hide the Patient';
      throw customError;
    }

    // ADD BACK FOR MULTI-TENANT
    // If episode exists an error is thrown, otherwise execution continues and
    // patient is deleted from the practice_patients and patients table
    /*
    try {
      const relatedRow = {
        practice_id: practiceId,
        patient_id: row.id,
      };
      await deleteData(relatedTable, relatedRow);
    */

    // MAKE CHANGE HERE FOR MULTI-TENANT --- ONLY WORKS FOR SINGLE TENANT
    // If any episode of care exists for any practice, don't delete the patient
    try {
      const practice_patients_body = {
        patient_id: row.id,
        practice_id: practiceId,
      };
      await deleteData(relatedTable, practice_patients_body);

      const patients_body = {
        id: row.id,
      };
      await deleteData(table, patients_body);

      // After both deletes have finished, update the rows
      setRows(oldRows.filter((r) => r.id !== id));
      return row;
    } catch (error) {
      setRows(oldRows);
      throw error;
    }
  }

  if (errorState.showError) {
    return (
      <ErrorAlert
        severity={errorState.errorSeverity}
        errorType={errorState.errorType}
        errorMessage={errorState.errorMessage}
        errorDescription={errorState.errorDescription}
        onClose={handleClose}
      />
    );
  }

  if (role === 'manager' || role === 'admin' || role === 'super') {
    return (
      <div>
        <DataEntry
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
        <ViewOnly
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
        />
      </div>
    );
  }
}

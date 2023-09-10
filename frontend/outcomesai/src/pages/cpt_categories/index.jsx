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

export default function CPTCategoryManageGrid() {
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
    getData(getTable)
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
  const title = 'CPT Categories';

  let subtitle = 'View CPT Categories';
  if (role === 'super') {
    subtitle = 'Manage CPT Categories';
  }

  const saveTable = 'cpt_categories';
  const getTable = 'cpt_categories';
  const requiredAttributes = ['name', 'description', 'status'];
  const attributeNames = ['Name', 'Description', 'Status'];

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      return newRow;
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
      name: '',
      description: '',
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
        const rowToSave = { ...row };
        // *************** CUSTOMIZE ************** END

        // Delete the id that was generated when row was created
        delete rowToSave.id;
        const data = await postData(saveTable, rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));
        return rowToSave;
      } else {
        await putData(saveTable, row);
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
          onDeleteRow={inActivateRow}
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

// *************** CUSTOMIZE ************** START

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'name',
    headerName: 'Category',
    editable: true,
    cellClassName: 'name-column--cell',
    flex: 1,
  },
  {
    field: 'description',
    headerName: 'Description',
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
    flex: 1,
  },
];
// *************** CUSTOMIZE ************** END

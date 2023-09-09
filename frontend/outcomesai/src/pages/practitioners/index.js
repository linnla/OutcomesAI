import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import UserContext from '../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../utils/API';
import {
  validateRequiredAttributes,
  validateEmail,
} from '../../utils/ValidationUtils';
import { createErrorMessage } from '../../utils/ErrorMessage';
import ErrorModal from '../../utils/ErrorModal';

export default function PractitionerManageGrid() {
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
  const title = 'Practitioners';
  const subtitle = 'Manage Practitioners';
  const saveTable = 'practitioners';
  const getTable = 'practice_practitioners';
  const requiredAttributes = ['last_name', 'first_name', 'email'];
  const attributeNames = ['Last Name', 'First Name', 'Email'];

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      validateEmail(newRow.email);
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
      last_name: '',
      first_name: '',
      suffix: '',
      prefix: '',
      email: '',
      status: 'Active',
    };
  };

  function formatFullName(row) {
    let fullName = '';

    if (row.prefix && row.prefix.trim() !== '') {
      fullName += row.prefix + ' ';
    }

    fullName += `${row.first_name} ${row.last_name}`;

    if (row.suffix && row.suffix.trim() !== '') {
      fullName += ' ' + row.suffix;
    }

    return fullName;
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
        const data = await postData(saveTable, rowToSave);
        // Add the id returned from the database
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));

        // *************** CUSTOMIZE ************** START
        rowToSave.status = 'Active';
        // Create one-to-many row
        const practicePractitioner = {
          practice_id: rowToSave.practice_id,
          practitioner_id: rowToSave.id,
        };
        await postData(getTable, practicePractitioner);
        rowToSave.full_name = formatFullName(row);
        // *************** CUSTOMIZE ************** END

        return rowToSave;
      } else {
        await putData(saveTable, row);

        // *************** CUSTOMIZE ************** START
        row.full_name = formatFullName(row);
        // *************** CUSTOMIZE ************** END

        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));

        return row;
      }
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE ************** START
      const fullName = formatFullName(row);
      const errorMessage = createErrorMessage(error, fullName);
      // *************** CUSTOMIZE ************** END

      throw errorMessage;
    }
  }

  async function inActivateRow(id, row, oldRows) {
    try {
      const practicePractitioner = {
        practice_id: row.practice_id,
        practitioner_id: row.id,
        status: 'Inactive',
      };
      await putData(getTable, practicePractitioner);
      row.status = 'Inactive';
      setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
      return 'Inactive';
    } catch (error) {
      setRows(oldRows);

      // *************** CUSTOMIZE ************** START
      const fullName = formatFullName(row);
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
    field: 'full_name',
    headerName: 'Name',
    editable: false,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'prefix',
    headerName: 'Prefix',
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Dr.', ''],
    defaultValueGetter: () => '',
    flex: 1,
  },
  {
    field: 'first_name',
    headerName: 'First',
    editable: true,
    flex: 1,
  },
  {
    field: 'last_name',
    headerName: 'Last',
    editable: true,
    flex: 1,
  },
  {
    field: 'suffix',
    headerName: 'Suffix',
    editable: true,
    type: 'singleSelect',
    valueOptions: [
      'MD',
      'DO',
      'PMHNP',
      'AGNP',
      'ANP',
      'FNP',
      'GNP',
      'LMFT',
      'MFT',
      'NP',
      'PA',
      'PhD',
      'WHNP',
      '',
    ],
    defaultValueGetter: () => '',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    editable: true,
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
  },
];
// *************** CUSTOMIZE ************** END

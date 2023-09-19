import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import OneToManyDataGrid from '../../components/datagrid/oneToMany';
import ReadOnlyDataGrid from '../../components/datagrid/readOnly';
import UserContext from '../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../utils/API';
import {
  validateRequiredAttributes,
  validateEmail,
} from '../../utils/ValidationUtils';
import { createErrorMessage } from '../../utils/ErrorMessage';
import ErrorModal from '../../utils/ErrorModal';

// *************** CUSTOMIZE ************** START
export default function PractitionerGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Practitioners';
  let subtitle = 'View Practitioners';
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Manage Practitioners';
  }

  const table = 'practitioners';
  const relatedTable = 'practice_practitioners';
  const sort_1 = 'last_name';
  const sort_2 = 'first_name';
  const requiredAttributes = ['last_name', 'first_name', 'email'];
  const attributeNames = ['Last Name', 'First Name', 'Email'];

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
    setRawRows(rows.map((r, i) => ({ ...r, no: i + 1 })));
  };

  function sortItems(items, sort_attribute_1, sort_attribute_2) {
    return items.sort((a, b) => {
      // Primary criterion: sort_attribute_1
      const comparison_1 = a[sort_attribute_1].localeCompare(
        b[sort_attribute_1]
      );

      // If the primary criteria are the same and sort_attribute_2 is provided, sort by sort_attribute_2
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
      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

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

  async function saveRow(id, row, oldRow, oldRows) {
    try {
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
          practitioner_id: rowToSave.id,
        };
        await postData(relatedTable, relatedRow);
        rowToSave.full_name = formatFullName(row);
        return rowToSave;
      } else {
        await putData(table, row);
        if (row.status !== oldRow.status) {
          const relatedRow = {
            practice_id: row.practice_id,
            practitioner_id: row.id,
            status: row.status,
          };
          await putData(relatedTable, relatedRow);
        }

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

  async function deleteRow(id, row, oldRows) {
    const body = {
      id: row.id,
    };

    try {
      await deleteData(table, body);
      setRows(oldRows.filter((r) => r.id !== id));

      const relatedRow = {
        practice_id: row.practice_id,
        practitioner_id: row.id,
      };
      await deleteData(relatedTable, relatedRow);
      return row;

      return 'Deleted';
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
        <OneToManyDataGrid
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

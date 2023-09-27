import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import ViewOnly from '../../../components/datagrid/viewOnly';
import DataEntry from '../../../components/datagrid/dataEntry';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import {
  validateRequiredAttributes,
  validateEmail,
} from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE ************** START
export default function PractitionersGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Practitioners';
  let subtitle = `View ${title}`;
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const table = 'practitioners';
  const relatedTable = 'practice_practitioners';
  const sort_1 = 'last_name';
  const sort_2 = 'first_name';
  const requiredAttributes = ['last_name', 'first_name', 'ehr_id', 'email'];
  const attributeNames = ['Last Name', 'First Name', 'EHR ID', 'Email'];

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
        'M.D.',
        'D.O.',
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
      field: 'ehr_id',
      headerName: 'EHR ID',
      editable: true,
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

  useEffect(() => {
    setLoading(true);
    getData(relatedTable, { practice_id: practiceId })
      .then((data) => {
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
            practitioner_ehr_id: row.ehr_id,
            status: row.status,
          };
          await putData(relatedTable, relatedRow);
        }
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

  async function episodesOfCareExists(row) {
    try {
      const data = await getData('episodes_of_care', {
        practice_id: practiceId,
        practitioner_id: row.id,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function deleteRow(id, row, oldRows) {
    const episodeExists = await episodesOfCareExists(row);
    if (episodeExists) {
      let fullName = formatFullName(row);
      const errorMessage = `${fullName} has treated a patient and cannot be deleted.\nSet the status to Inactive to hide the Practitioner.`;
      throw errorMessage;
    }

    try {
      const relatedRow = {
        practice_id: practiceId,
        practitioner_id: row.id,
      };
      await deleteData(relatedTable, relatedRow);

      // Delete from patients
      const body = {
        id: row.id,
      };
      await deleteData(table, body);

      // After both deletes have finished, update the rows
      setRows(oldRows.filter((r) => r.id !== id));
      return row;
    } catch (error) {
      setRows(oldRows);
      let fullName = `${row.first_name} ${row.last_name}`;
      const errorMessage = createErrorMessage(error, fullName);
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

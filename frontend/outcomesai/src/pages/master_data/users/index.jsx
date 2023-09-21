import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import EditOnly from '../../../components/datagrid/editOnly';
import ViewOnly from '../../../components/datagrid/viewOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE ************** START
export default function UsersGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Users';
  let subtitle = `View ${title}`;
  if (role === 'super' || role === 'admin') {
    subtitle = 'Add, Edit, Delete';
  }

  const sort_1 = 'last_name';
  const sort_2 = 'first_name';
  const table = 'practice_users';
  const relatedTable = 'roles';
  const requiredAttributes = ['role_name', 'status'];
  const attributeNames = ['Role', 'Status'];

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
    getData(table, { practice_id: practiceId })
      .then((data) => {
        const sortedItems = sortItems(data, sort_1, sort_2);
        setRows(sortedItems);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, table);
        setErrorType('Data Fetch Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId]);

  const [relatedData, setRelatedData] = useState([]);
  const [relatedObjects, setRelatedObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData(relatedTable)
      .then((data) => {
        const relatedData = data.map((obj) => obj.name).sort();
        setRelatedData(relatedData);
        // Used to get the id property of user select a different category
        setRelatedObjects(data);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, relatedTable);
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Columns must be defined after relatedData gets loaded in useEffect
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'last_name',
      headerName: 'Last Name',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'role_name',
      headerName: 'Role',
      editable: true,
      type: 'singleSelect',
      valueOptions: relatedData,
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
      if (newRow.role_name !== oldRow.role_name) {
        const correspondingObject = relatedObjects.find(
          (obj) => obj.name === newRow.role_name
        );
        newRow.role_id = correspondingObject.id;
      }

      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

  // You can only update the user's role.  User's get created via Cognito login process.
  async function saveRow(id, row, oldRow, oldRows) {
    try {
      await putData(table, row);
      setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
      return row;
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

  if (role === 'super' || role === 'admin') {
    return (
      <div>
        <EditOnly
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          onValidateRow={validateRow}
          onSaveRow={saveRow}
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

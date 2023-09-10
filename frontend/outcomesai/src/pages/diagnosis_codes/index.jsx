import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import '../../index.css';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import UserContext from '../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../utils/API';
import { validateRequiredAttributes } from '../../utils/ValidationUtils';
import { createErrorMessage } from '../../utils/ErrorMessage';
import ErrorModal from '../../utils/ErrorModal';

export default function DiagnosisCodeManageGrid() {
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
        console.log('data:', data);
        const sortedArray = data.sort((a, b) => a.code.localeCompare(b.code));
        setRows(sortedArray);
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
  }, []);

  // *************** CUSTOMIZE ************** START

  const [disorders, setDisorders] = useState([]);
  const [disorderObjects, setDisorderObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData('disorders')
      .then((data) => {
        const disorders = data.map((obj) => obj.name).sort();
        setDisorders(disorders);
        // Used to get the id property of user select a different category
        setDisorderObjects(data);
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
  }, []);

  const title = 'Diagnosis Codes';

  let subtitle = 'View Diagnosis Codes';
  if (role === 'super') {
    subtitle = 'Manage Diagnosis Codes';
  }

  const saveTable = 'diagnosis_codes';
  const getTable = 'diagnosis_codes';
  const requiredAttributes = ['code', 'disorder_id', 'description', 'status'];
  const attributeNames = [
    'Diagnosis Code',
    'Disorder',
    'Dsecription',
    'Status',
  ];

  function createRowData(rows) {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      code: '',
      disorder_id: '',
      disorder_name: '',
      description: '',
      status: 'Active',
    };
  }

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, getTable);
      throw errorMessage;
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'code',
      headerName: 'Diagnosis Code',
      editable: true,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'disorder_name',
      headerName: 'Disorder',
      type: 'singleSelect',
      valueOptions: disorders,
      editable: true,
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

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      // Get the id for the cpt_category the user selected
      if (row.disorder_name !== oldRow.disorder_name) {
        const correspondingObject = disorderObjects.find(
          (obj) => obj.name === row.disorder_name
        );
        row.disorder_id = correspondingObject.id;
      }

      console.log('saveRow row:', row);
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

        // *************** CUSTOMIZE ************** START
        // Create one-to-many row
        // No one-to-many tables for Offices
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
      const errorMessage = createErrorMessage(error, row.name);
      // *************** CUSTOMIZE ************** END

      throw errorMessage;
    }
  }

  async function inActivateRow(id, row, oldRows) {
    try {
      const inactiveRow = {
        id: row.id,
        status: 'Inactive',
      };
      await putData(getTable, inactiveRow);
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

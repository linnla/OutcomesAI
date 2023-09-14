import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import EditableDataGrid from '../../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../../components/datagrid/readonly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE **************
export default function DiagnosisCodeGrid() {
  const title = 'Diagnosis Codes';
  const table = 'diagnosis_codes';
  const relatedTable = 'disorders';
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

  // *************** CUSTOMIZE **************

  const { role } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete, Inactivate';
  }

  useEffect(() => {
    setLoading(true);
    getData(table)
      .then((data) => {
        //console.log('data:', data);
        const sortedArray = data.sort((a, b) => a.code.localeCompare(b.code));
        setRows(sortedArray);
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
  }, []);

  const [relatedData, setRelatedData] = useState([]);
  const [relatedObjects, setRelatedObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData(relatedTable)
      .then((data) => {
        //console.log('related data:', data);
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

  async function validateRow(newRow) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
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
      valueOptions: relatedData,
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
      // Get the id for the disorder the user selected

      // *************** CUSTOMIZE **************
      if (row.disorder_name !== oldRow.disorder_name) {
        const correspondingObject = relatedObjects.find(
          (obj) => obj.name === row.disorder_name
        );
        row.disorder_id = correspondingObject.id;
      }
      // *************** CUSTOMIZE **************

      console.log('saveRow row:', row);
      if (row.isNew) {
        const rowToSave = { ...row };
        delete rowToSave.id;
        const data = await postData(table, rowToSave);
        rowToSave.id = data.data.id;
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));
        return rowToSave;
      } else {
        await putData(table, row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);
      const errorMessage = createErrorMessage(error, row.code);
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
      return 'Deleted';
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

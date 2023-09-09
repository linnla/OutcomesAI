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

export default function CPTCodeGrid() {
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
        const sortedArray = data.sort((a, b) =>
          a.cpt_code.localeCompare(b.cpt_code)
        );
        console.log('cpt codes sorted array:', sortedArray);
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

  const [cpt_categories, setCptCategories] = useState([]);
  const [cpt_categoryObjects, setCptCategoryObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData('cpt_categories')
      .then((data) => {
        const categories = data.map((obj) => obj.name).sort();
        setCptCategories(categories);
        // Used to get the id property of user select a different category
        setCptCategoryObjects(data);
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

  const title = 'CPT Codes';
  const subtitle = 'Manage CPT Codes';
  const saveTable = 'cpt_codes';
  const getTable = 'cpt_codes';
  const requiredAttributes = ['cpt_code', 'cpt_category_id', 'description'];
  const attributeNames = ['CPT Code', 'CPT Category', 'Dsecription'];

  function createRowData(rows) {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      cpt_code: '',
      category_id: '',
      description: '',
      status: 'Active',
      virtual: false,
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
      field: 'cpt_code',
      headerName: 'CPT Code',
      editable: true,
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'cpt_category_name',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: cpt_categories,
      editable: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true,
      cellClassName: 'wrapText',
      width: 400,
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
      if (row.cpt_category_name !== oldRow.cpt_category_name) {
        const correspondingObject = cpt_categoryObjects.find(
          (obj) => obj.name === row.cpt_category_name
        );
        row.cpt_category_id = correspondingObject.id;
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

  console.log(rows);
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

import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import ViewOnly from '../../../components/datagrid/viewOnly';
import DataEntry from '../../../components/datagrid/dataEntry';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import {
  validatePostalCodeFormat,
  validatePostalCodeExists,
  validateRequiredAttributes,
  validateIsInteger,
} from '../../../utils/ValidationUtils';
import ShowAlert from '../../../utils/ShowAlert';
import { useNotificationHandling } from '../../../utils/NotificationHandling';

// *************** CUSTOMIZE ************** START

export default function OfficesGrid() {
  const { role, practiceId } = useContext(UserContext);
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const title = 'Offices';
  let subtitle = `View ${title}`;
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const table = 'offices';
  const sort_1 = 'name';
  const sort_2 = 'null';
  const requiredAttributes = ['name', 'postal_code'];
  const attributeNames = ['Office name', 'Postal Code'];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'ehr_id',
      headerName: 'EHR ID',
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
      flex: 1,
    },
    {
      field: 'virtual',
      headerName: 'Telehealth',
      editable: true,
      type: 'boolean',
      defaultValueGetter: () => false,
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

  function createRowData(rows) {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      name: '',
      ehr_id: null,
      postal_code: '',
      status: 'Active',
      virtual: false,
    };
  }
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
    if (!practiceId || practiceId === '') {
      // Exit early if practiceId is empty or falsy
      return;
    }

    setLoading(true);
    getData(table, { practice_id: practiceId })
      .then((data) => {
        //console.log('data:', data);
        const sortedItems = sortItems(data, sort_1, sort_2);
        setRows(sortedItems);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId, handleErrorNotification]);

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

  async function validateRow(newRow, oldRows) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      if (newRow['ehr_id'] !== '' && newRow['ehr_id'] !== null) {
        validateIsInteger('EHR ID', newRow['ehr_id']);
      }
      validatePostalCodeFormat(newRow.postal_code);
      const postalCodeInfo = await validatePostalCodeExists(newRow.postal_code);
      const updatedRow = { ...newRow, ...postalCodeInfo };
      return updatedRow;
    } catch (error) {
      //console.log('validate row error:', error);

      throw error;
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
        return rowToSave;
      } else {
        await putData(table, row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      console.log('index.jsx error', error);
      setRows(oldRows);
      throw error;
    }
  }

  async function episodesOfCareExists(row) {
    try {
      await getData('episodes_of_care', {
        practice_id: practiceId,
        office_id: row.id,
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
      const customError = new Error();
      customError.name = 'Delete Error';
      customError.message = `The ${row.name} office has treated patients and cannot be deleted.\nSet the status to Inactive to hide the Office.`;
      throw customError;
    }

    const body = {
      practice_id: row.practice_id,
      id: row.id,
    };

    try {
      await deleteData(table, body);
      setRows(oldRows.filter((r) => r.id !== id));
      return 'Deleted';
    } catch (error) {
      setRows(oldRows);
      throw error;
    }
  }

  if (notificationState.showNotification) {
    return (
      <ShowAlert
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
        description={notificationState.description}
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

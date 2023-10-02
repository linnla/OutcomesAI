import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import DataEntry from '../../../components/datagrid/dataEntry';
import ViewOnly from '../../../components/datagrid/viewOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import ShowAlert from '../../../utils/ShowAlert';
import { useNotificationHandling } from '../../../utils/NotificationHandling';

// *************** CUSTOMIZE ************** START
export default function PracticeIntegrationsGrid() {
  const { role, practiceId } = useContext(UserContext);
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const title = 'EHR Integrations';
  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const sort_1 = 'integration_vendor_name';
  const sort_2 = 'integration_type+name';
  const table = 'practice_integrations';

  const requiredAttributes = [
    'integration_type_name',
    'integration_vendor_name',
    'client_id',
    'client_secret',
    'refresh_token',
  ];
  const attributeNames = [
    'Integration Type',
    'Integration Vendor',
    'Client ID',
    'Client Secret',
    'Refresh Token',
  ];

  function createRowData(rows) {
    // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      integration_type_name: '',
      integration_vendor_name: '',
      client_id: '',
      client_secret: '',
      refresh_token: '',
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
    console.log('practiceId:', practiceId);
    getData(table, { practice_id: practiceId })
      .then((data) => {
        //console.log('data:', data);
        const sortedItems = sortItems(data, sort_1, sort_2);
        const rowsWithId = sortedItems.map((row, index) => ({
          id: index, // or use another logic to generate a unique ID
          ...row,
        }));
        setRows(rowsWithId);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId, handleErrorNotification]);

  const [integrationTypeData, setIntegrationTypeData] = useState([]);
  const [integrationTypeObjects, setIntegrationTypeObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData('integration_types')
      .then((data) => {
        //console.log('related data:', data);
        const sortedData = data.map((obj) => obj.name).sort();
        setIntegrationTypeData(sortedData);
        // Used to get the id property of user select a different category
        setIntegrationTypeObjects(data);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  const [integrationVendorData, setIntegrationVendorData] = useState([]);
  const [integrationVendorObjects, setIntegrationVendorObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData('integration_vendors')
      .then((data) => {
        //console.log('related data:', data);
        const sortedData = data.map((obj) => obj.name).sort();
        setIntegrationVendorData(sortedData);
        // Used to get the id property of user select a different category
        setIntegrationVendorObjects(data);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  // These need to load after the related data useEffect
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'integration_vendor_name',
      headerName: 'EHR Vendor',
      type: 'singleSelect',
      valueOptions: integrationVendorData,
      editable: true,
      width: 100,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'integration_type_name',
      headerName: 'Integration Type',
      type: 'singleSelect',
      valueOptions: integrationTypeData,
      editable: true,
      width: 200,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'client_id',
      headerName: 'Client ID',
      editable: true,
      headerAlign: 'left',
      align: 'left',
      cellClassName: 'wrap-column--cell',
      flex: 1,
    },
    {
      field: 'client_secret',
      headerName: 'Client Secret',
      editable: true,
      cellClassName: 'wrapWord',
      flex: 1,
    },
    {
      field: 'refresh_token',
      headerName: 'Refresh Token',
      editable: true,
      cellClassName: 'wrapText',
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

      if (newRow.integration_type_name !== oldRow.integration_type_name) {
        const correspondingObject = integrationTypeObjects.find(
          (obj) => obj.name === newRow.integration_type_name
        );
        newRow.integration_type_id = correspondingObject.id;
      }

      if (newRow.integration_vendor_name !== oldRow.integration_vendor_name) {
        const correspondingObject = integrationVendorObjects.find(
          (obj) => obj.name === newRow.integration_vendor_name
        );
        newRow.integration_vendor_id = correspondingObject.id;
      }

      newRow.practice_id = practiceId;
      console.log('newRow', newRow);
      return newRow;
    } catch (error) {
      throw error;
    }
  }

  async function saveRow(id, row, oldRow, oldRows) {
    try {
      console.log('saveRow row:', row);
      if (row.isNew) {
        const rowToSave = { ...row };
        delete rowToSave.id;
        console.log('rowToSave POST:', rowToSave);
        const data = await postData(table, rowToSave);
        rowToSave.id = data.data.id;
        console.log('Post return:', rowToSave);
        setRows(oldRows.map((r) => (r.id === id ? { ...rowToSave } : r)));
        return rowToSave;
      } else {
        console.log('row PUT:', row);
        await putData(table, row);
        setRows(oldRows.map((r) => (r.id === id ? { ...row } : r)));
        return row;
      }
    } catch (error) {
      setRows(oldRows);
      throw error;
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

  if (role === 'super') {
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

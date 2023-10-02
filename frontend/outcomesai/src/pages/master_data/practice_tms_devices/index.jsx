import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import MultiSelectFieldsFilters from '../../../components/datagrid/multiSelectFieldsFilters';
import ViewOnly from '../../../components/datagrid/viewOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import ShowAlert from '../../../utils/ShowAlert';
import { useNotificationHandling } from '../../../utils/NotificationHandling';

// *************** CUSTOMIZE ************** START
export default function PracticeTMSDevicesGrid() {
  const { role, practiceId } = useContext(UserContext);
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const title = 'Office TMS Devices';
  let subtitle = `View ${title}`;
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const table = 'practice_tms_devices';
  const sort_1 = 'office_name';
  const sort_2 = 'device_name';
  const requiredAttributes = ['office_name', 'device_name', 'coil_name'];
  const attributeNames = ['Office', 'TMS Device', 'TMS Coil'];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'office_name',
      headerName: 'Office',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    {
      field: 'device_mfg',
      headerName: 'Device Mfg',
      flex: 1,
    },
    {
      field: 'device_name',
      headerName: 'Device Name',
      flex: 1,
    },
    {
      field: 'coil_mfg',
      headerName: 'Coil Mfg',
      flex: 1,
    },
    {
      field: 'coil_name',
      headerName: 'Coil',
      flex: 1,
    },
  ];
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

  const [officeObjects, setOfficeObjects] = useState([]);
  const [officeNames, setOfficeNames] = useState([]);
  const [deviceObjects, setDeviceObjects] = useState([]);
  const [deviceNames, setDeviceNames] = useState([]);
  const [deviceMfgs, setDeviceMfgs] = useState([]);
  const [coilObjects, setCoilObjects] = useState([]);
  const [coilNames, setCoilNames] = useState([]);
  const [coilMfgs, setCoilMfgs] = useState([]);

  // The table has multiple foriegn keys that generate the primary key,
  // Generate an id key for the datagrid to use
  useEffect(() => {
    if (!practiceId || practiceId === '') {
      // Exit early if practiceId is empty or falsy
      return;
    }

    setLoading(true);
    getData(table, { practice_id: practiceId })
      .then((data) => {
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
  }, [
    practiceId,
    handleErrorNotification,
    officeNames,
    deviceMfgs,
    deviceNames,
    coilMfgs,
    coilNames,
  ]);

  // Offices
  useEffect(() => {
    setLoading(true);
    getData('offices', { practice_id: practiceId })
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setOfficeNames(sortedNames);
        setOfficeObjects(activeData);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId, handleErrorNotification]);

  // Devices
  useEffect(() => {
    setLoading(true);
    getData('tms_devices')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setDeviceNames(sortedNames);
        const sortedMfgs = [
          ...new Set(data.map((obj) => obj.manufacturer)),
        ].sort();
        setDeviceMfgs(sortedMfgs);
        setDeviceObjects(data);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  // Coils
  useEffect(() => {
    setLoading(true);
    getData('tms_coils')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        console.log('coils Names:', sortedNames);
        setCoilNames(sortedNames);
        const sortedMfgs = [
          ...new Set(data.map((obj) => obj.manufacturer)),
        ].sort();
        setCoilMfgs(sortedMfgs);
        console.log('coils Mfgs:', sortedMfgs);
        setCoilObjects(data);
        console.log('coil Objects:', data);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function validateRow(row) {
    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, row);

      const officeObject = officeObjects.find(
        (obj) => obj.name === row.office_name
      );
      row.office_id = officeObject.id;

      const deviceObject = deviceObjects.find(
        (obj) => obj.name === row.device_name
      );
      row.device_mfg = deviceObject.manufacturer;
      row.tms_device_id = deviceObject.id;

      const coilObject = coilObjects.find((obj) => obj.name === row.coil_name);
      row.coil_mfg = coilObject.manufacturer;
      row.tms_coil_id = coilObject.id;

      row.practice_id = practiceId;
      const randomNum = getRandomInt(1, 1000000);
      row.id = randomNum;
      return row;
    } catch (error) {
      throw error;
    }
  }

  async function saveRow(row, oldRows) {
    try {
      await postData(table, row);
      return row;
    } catch (error) {
      setRows(oldRows); /// Not sure if this belongs here, need to test
      throw error;
    }
  }

  async function deleteRow(id, row, oldRows) {
    const body = {
      practice_id: row.practice_id,
      tms_device_id: row.device_id,
      tms_coil_id: row.coil_id,
      office_id: row.office_id,
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
        <MultiSelectFieldsFilters
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          field1Label='Office'
          field1Objects={officeObjects}
          field1ValueAttribute='name'
          attribute1='office_name'
          field2Label='TMS Device'
          field2Objects={deviceObjects}
          field2ValueAttribute='name'
          attribute2='device_name'
          matchAttribute='manufacturer'
          field3Label='TMS Coil'
          field3Objects={coilObjects}
          field3ValueAttribute='manufacturer'
          attribute3='coil_name'
          onValidateRow={validateRow}
          onSaveRow={saveRow}
          onDeleteRow={deleteRow}
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

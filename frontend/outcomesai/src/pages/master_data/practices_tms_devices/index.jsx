import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import ManyToManyDataGrid from '../../../components/datagrid/manyToMany';
import ReadOnlyDataGrid from '../../../components/datagrid/readOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE **************
export default function PracticeTMSDevicesGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Office TMS Devices';
  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add & Delete';
  }

  const table = 'practice_tms_devices';
  const sort_1 = 'office_name';
  const sort_2 = 'device_name';
  const requiredAttributes = ['office_name', 'device_name', 'coil_name'];
  const attributeNames = ['Office', 'TMS Device', 'TMS Coil'];

  // *************** CUSTOMIZE **************

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
    setLoading(true);
    getData(table)
      .then((data) => {
        const sortedItems = sortItems(data, sort_1, sort_2);
        const rowsWithId = sortedItems.map((row, index) => ({
          id: index, // or use another logic to generate a unique ID
          ...row,
        }));
        setRows(rowsWithId);
      })
      .catch((error) => {
        const errorMessage = createErrorMessage(error, table);
        setErrorType('Data Fetch Error');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
        //}
      })
      .finally(() => {
        setLoading(false);
      });
  }, [officeNames, deviceMfgs, deviceNames, coilMfgs, coilNames]);

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
        console.error('offices:', error);
        const errorMessage = createErrorMessage(error, 'offices');
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [practiceId]);

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
        console.error('devices:', error);
        const errorMessage = createErrorMessage(error, 'devices');
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Coils
  useEffect(() => {
    setLoading(true);
    getData('tms_coils')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setCoilNames(sortedNames);
        const sortedMfgs = [
          ...new Set(data.map((obj) => obj.manufacturer)),
        ].sort();
        setCoilMfgs(sortedMfgs);
        setCoilObjects(data);
      })
      .catch((error) => {
        console.error('coils:', error);
        const errorMessage = createErrorMessage(error, 'coils');
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'office_name',
      headerName: 'Office',
      type: 'singleSelect',
      valueOptions: officeNames,
      editable: true,
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    {
      field: 'device_mfg',
      headerName: 'Device Mfg',
      type: 'singleSelect',
      valueOptions: deviceMfgs,
      editable: true,
      flex: 1,
    },
    {
      field: 'device_name',
      headerName: 'Device Name',
      type: 'singleSelect',
      valueOptions: deviceNames,
      editable: true,
      flex: 1,
    },
    {
      field: 'coil_mfg',
      headerName: 'Coil Mfg',
      editable: true,
      type: 'singleSelect',
      valueOptions: coilMfgs,
      cellClassName: 'wrapText',
      flex: 1,
    },
    {
      field: 'coil_name',
      headerName: 'Coil',
      editable: true,
      type: 'singleSelect',
      valueOptions: coilNames,
      cellClassName: 'wrapText',
      flex: 1,
    },
  ];

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
      let message = `${row.office_name} with ${row.device_name} device and coil ${row.coil_name}`;
      const errorMessage = createErrorMessage(error, message);
      throw errorMessage;
    }
  }

  async function saveRow(row) {
    try {
      await postData(table, row);
      return row;
    } catch (error) {
      let message = `${row.office_name} with ${row.device_name} device and coil ${row.coil_name}`;
      const errorMessage = createErrorMessage(error, message);
      throw errorMessage;
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
        <ManyToManyDataGrid
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
          field3ValueAttribute='name'
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

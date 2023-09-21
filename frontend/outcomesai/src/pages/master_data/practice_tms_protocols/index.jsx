import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import DynamicMultiSelectFields from '../../../components/datagrid/dynamicMultiSelectFields';
import ViewOnly from '../../../components/datagrid/viewOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';

// *************** CUSTOMIZE ************** START
export default function PracticeTMSProtocolsGrid() {
  const { role, practiceId } = useContext(UserContext);

  const title = 'Practice TMS Procotols';
  let subtitle = `View ${title}`;
  if (role === 'manager' || role === 'admin' || role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }
  const table = 'practice_tms_protocols';
  const sort_1 = 'tms_protocol_name';
  const sort_2 = 'null';
  const requiredAttributes = ['name'];
  const attributeNames = ['TMS Protocol'];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'tms_protocol_name',
      headerName: 'Protocol Name',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    {
      field: 'pulse_type_name',
      headerName: 'Pulse Type',
      flex: 1,
    },
    {
      field: 'stimulation_site_name',
      headerName: 'Stimulation Site',
      flex: 1,
    },
    {
      field: 'frequency_name',
      headerName: 'Frequency',
      align: 'center',
      headerAlign: 'center',
      width: 80,
    },
    {
      field: 'train_time',
      headerName: 'Train Time',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      width: 80,
    },
    {
      field: 'inter_train_time',
      headerName: 'Inter Train Time',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      width: 80,
    },
  ];
  // *************** CUSTOMIZE ************** END

  const [rows, setRawRows] = useState([]);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fieldConfig, setFieldConfig] = useState([]);

  const setRows = (rows) => {
    if (!Array.isArray(rows)) {
      console.error('setRows received non-array data:', rows);
      return;
    }
    setRawRows(rows.map((r, i) => ({ ...r, no: i + 1 })));
  };

  const [tmsProtocolObjects, setTMSProtocolObjects] = useState([]);

  // The table has multiple foriegn keys that generate the primary key,
  // Generate an id key for the datagrid to use
  useEffect(() => {
    setLoading(true);
    getData(table)
      .then((data) => {
        console.log('data:', data);
        const sortedItems = sortItems(data, sort_1, sort_2);
        const rowsWithId = sortedItems.map((row, index) => ({
          id: index, // or use another logic to generate a unique ID
          ...row,
        }));
        console.log('rowsWithId:', rowsWithId);
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
  }, [practiceId, tmsProtocolObjects]);

  // TMS Protocols
  useEffect(() => {
    setLoading(true);
    getData('tms_protocols')
      .then((data) => {
        console.log('tms_protocols:', data);
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        setTMSProtocolObjects(activeData);
      })
      .catch((error) => {
        console.error('tms_protocols:', error);
        const errorMessage = createErrorMessage(error, 'tms_protocols');
        setErrorType('Error fetching data');
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fields
  useEffect(() => {
    const tmsProtocolNames = tmsProtocolObjects
      .map((item) => item['name'])
      .sort();

    const selectFields = [
      {
        label: 'TMS Protocols', // Label for the select field
        options: tmsProtocolNames, // Array of options for the select field
        objects: tmsProtocolObjects, // The attribute in each option object that represents the value
        valueAttribute: 'name',
        attribute: 'name', // The attribute name to use when creating rows
      },
    ];
    setFieldConfig(selectFields);
  }, [tmsProtocolObjects]);

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

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function validateRow(row) {
    console.log('validateRow:', row);

    try {
      validateRequiredAttributes(requiredAttributes, attributeNames, row);

      const object = tmsProtocolObjects.find((obj) => obj.name === row.name);
      row.tms_protocol_id = object.id;
      row.tms_protocol_name = row.name;
      row.frequency_name = object.frequency_name;
      row.pulse_type_name = object.pulse_type_name;
      row.stimulation_site_name = object.stimulation_site_name;
      row.train_time = object.train_time;
      row.inter_train_time = object.inter_train_time;
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
      tms_protocol_id: row.tms_protocol_id,
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

  if (role === 'manager' || role === 'admin' || role === 'super') {
    return (
      <div>
        <DynamicMultiSelectFields
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          fields={fieldConfig}
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

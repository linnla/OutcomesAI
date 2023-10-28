import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import DataEntry from '../../../components/datagrid/dataEntry';
import ViewOnly from '../../../components/datagrid/viewOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { GridEditInputCell } from '@mui/x-data-grid-premium';
import ShowAlert from '../../../utils/ShowAlert';
import { useNotificationHandling } from '../../../utils/NotificationHandling';

// *************** CUSTOMIZE **************
export default function TMSProtocolGrid() {
  const { role } = useContext(UserContext);
  const { notificationState, handleErrorNotification, handleClose } =
    useNotificationHandling();

  const title = 'TMS Protocols';
  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete, Inactivate';
  }

  const table = 'tms_protocols';
  const sort_1 = 'pulse_type_name';
  const sort_2 = 'stimulation_site_name';
  const requiredAttributes = [
    'name',
    'pulse_type_id',
    'stimulation_site_id',
    'pulse_frequency_id',
    'motor_threshold_percent',
    'trains',
    'train_time',
    'inter_train_time',
    'status',
  ];
  const attributeNames = [
    'Protocol Name',
    'Pulse Type',
    'Stimulation Site',
    'Pulse Frequency',
    'Motor Threshold Percent',
    'Trains',
    'Train Time',
    'Inter Train Time',
    'Status',
  ];

  function createRowData(rows) {
    const newId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: newId,
      name: '',
      pulse_type_id: 0,
      pulse_type_name: '',
      stimulation_site_id: 0,
      stimulation_site_name: '',
      motor_threshold_percent: 0,
      pulse_frequency_id: 0,
      pulse_frequency_name: '',
      burst_frequency_id: 0,
      burst_frequency_name: '',
      trains: 0,
      train_time: 0,
      inter_train_time: 0,
      status: 'Active',
    };
  }

  // *************** CUSTOMIZE **************

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

  const [pulseTypeObjects, setPulseTypeObjects] = useState([]);
  const [stimulationSitesObjects, setStimulationSiteObjects] = useState([]);
  const [frequencyObjects, setFrequencyObjects] = useState([]);

  const [pulseTypeNames, setPulseTypeNames] = useState([]);
  const [stimulationSitesNames, setStimulationSiteNames] = useState([]);
  const [frequencyNames, setFrequencyNames] = useState([]);

  // The table has multiple foriegn keys that generate the primary key,
  // Genrate an id key for the datagrid to use
  useEffect(() => {
    setLoading(true);
    getData(table)
      .then((data) => {
        console.log('data:', data);
        const sortedItems = sortItems(data, sort_1, sort_2);
        setRows(sortedItems);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    handleErrorNotification,
    pulseTypeObjects,
    stimulationSitesObjects,
    frequencyObjects,
  ]);

  // TMS Pulse Types
  useEffect(() => {
    setLoading(true);
    getData('tms_pulse_types')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setPulseTypeNames(sortedNames);
        setPulseTypeObjects(activeData);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  // TMS Stimulation Sites
  useEffect(() => {
    setLoading(true);
    getData('tms_stimulation_sites')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setStimulationSiteNames(sortedNames);
        setStimulationSiteObjects(activeData);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  // TMS Frequencies
  useEffect(() => {
    setLoading(true);
    getData('tms_frequencies')
      .then((data) => {
        // Filter out rows where status is not Active
        const activeData = data.filter((row) => row.status === 'Active');
        const sortedNames = activeData.map((obj) => obj.name).sort();
        setFrequencyNames(sortedNames);
        setFrequencyObjects(activeData);
      })
      .catch((error) => {
        handleErrorNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleErrorNotification]);

  async function validateRow(newRow, oldRow) {
    try {
      validateRequiredAttributes(
        ['stimulation_site_name'],
        ['Stimulation Site'],
        newRow
      );
      validateRequiredAttributes(['pulse_type_name'], ['Pulse Type'], newRow);
      validateRequiredAttributes(
        ['pulse_frequency_name'],
        ['Pulse Frequency'],
        newRow
      );

      if (
        !oldRow ||
        newRow.stimulation_site_name !== oldRow.stimulation_site_name
      ) {
        const stimulationSiteObject = stimulationSitesObjects.find(
          (obj) => obj.name === newRow.stimulation_site_name
        );
        newRow.stimulation_site_id = stimulationSiteObject.id;
      }

      if (!oldRow || newRow.pulse_type_name !== oldRow.pulse_type_name) {
        const pulseTypeObject = pulseTypeObjects.find(
          (obj) => obj.name === newRow.pulse_type_name
        );
        newRow.pulse_type_id = pulseTypeObject.id;
      }

      let frequencyObject = {};
      if (
        !oldRow ||
        newRow.pulse_frequency_name !== oldRow.pulse_frequency_name
      ) {
        frequencyObject = frequencyObjects.find(
          (obj) => obj.name === newRow.pulse_frequency_name
        );
        newRow.pulse_frequency_id = frequencyObject.id;
      }

      frequencyObject = 0;
      if (
        !oldRow ||
        newRow.burst_frequency_name !== oldRow.burst_frequency_name
      ) {
        frequencyObject = frequencyObjects.find(
          (obj) => obj.name === newRow.burst_frequency_name
        );
        newRow.burst_frequency_id = frequencyObject.id;
      }
      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      console.log('End Validate Row:', newRow);
      return newRow;
    } catch (error) {
      throw error;
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Protocol Name',
      editable: true,
      cellClassName: 'name-column--cell',
      width: 200,
    },
    {
      field: 'pulse_type_name',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: pulseTypeNames,
      editable: true,
      flex: 1,
    },
    {
      field: 'stimulation_site_name',
      headerName: 'Site',
      type: 'singleSelect',
      valueOptions: stimulationSitesNames,
      editable: true,
      flex: 1,
    },
    {
      field: 'motor_threshold_percent',
      headerName: 'MT %',
      type: 'number',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 200,
            min: 50,
          }}
        />
      ),
      width: 100,
    },
    {
      field: 'pulse_frequency_name',
      headerName: 'Pulse',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      valueOptions: frequencyNames,
      editable: true,
      width: 75,
    },
    {
      field: 'burst_frequency_name',
      headerName: 'Burst',
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      valueOptions: frequencyNames,
      editable: true,
      width: 75,
    },
    {
      field: 'trains',
      headerName: 'Trains',
      type: 'number',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 100,
            min: 1,
          }}
        />
      ),
      width: 75,
    },
    {
      field: 'train_time',
      headerName: 'Train',
      type: 'number',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 100,
            min: 1,
          }}
        />
      ),
      width: 75,
    },
    {
      field: 'inter_train_time',
      headerName: 'Inter-Train',
      type: 'number',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 100,
            min: 1,
          }}
        />
      ),
      width: 75,
    },
  ];

  async function saveRow(id, row, oldRow, oldRows) {
    console.log('saveRow:', row);
    try {
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

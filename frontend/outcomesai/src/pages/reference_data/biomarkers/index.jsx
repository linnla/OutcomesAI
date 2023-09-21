import * as React from 'react';
import '../../../index.css';
import { useEffect, useState, useContext } from 'react';
import OneToManyDataGrid from '../../../components/datagrid/oneToMany';
import ReadOnlyDataGrid from '../../../components/datagrid/readOnly';
import UserContext from '../../../contexts/UserContext';
import { getData, postData, putData, deleteData } from '../../../utils/API';
import { validateRequiredAttributes } from '../../../utils/ValidationUtils';
import { createErrorMessage } from '../../../utils/ErrorMessage';
import ErrorModal from '../../../utils/ErrorModal';
import { Box, Chip, Stack } from '@mui/material';

// *************** CUSTOMIZE ************** START
export default function BiomarkersGrid() {
  const { role } = useContext(UserContext);

  const title = 'Biomarkers';
  let subtitle = `View ${title}`;
  if (role === 'super') {
    subtitle = 'Add, Edit, Delete';
  }

  const sort_1 = 'biomarker_type_name';
  const sort_2 = 'acronym';
  const table = 'biomarkers';
  const relatedTable = 'biomarker_types';
  const requiredAttributes = [
    'acronym',
    'name',
    'biomarker_type_id',
    'biomarker_values',
    'status',
  ];
  const attributeNames = [
    'Biomarker Acronym',
    'Biomarker Name',
    'Biomarker Type',
    'Biomarker Values',
    'Status',
  ];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'acronym',
      headerName: 'Biomarker Code',
      editable: true,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'biomarker_type_name',
      headerName: 'Biomarker Type',
      type: 'singleSelect',
      valueOptions: relatedData,
      editable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Biomarker Name',
      editable: true,
      flex: 1,
    },
    {
      field: 'biomarker_values',
      headerName: 'Biomarker Values',
      editable: true,
      flex: 1,
      type: 'multipleSelect',
      valueOptions: [...new Set(rows.map((o) => o.biomarker_values).flat())],
      renderCell: (params) => (
        <Stack direction='row' spacing={0.25}>
          {params.row.biomarker_values.map((biomarker_value) => (
            <Chip label={biomarker_value} />
          ))}
        </Stack>
      ),
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
      acronym: '',
      name: '',
      biomarker_type_id: '',
      biomarker_type_name: '',
      biomarker_values: [],
      status: 'Active',
    };
  }
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
    getData(table)
      .then((data) => {
        //console.log('data:', data);
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
  }, []);

  const [relatedData, setRelatedData] = useState([]);
  const [relatedObjects, setRelatedObjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    getData(relatedTable)
      .then((data) => {
        console.log('related data:', data);
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
      validateRequiredAttributes(
        ['biomarker_type_name'],
        ['Biomarker Name'],
        newRow
      );
      if (newRow.biomarker_type_name !== oldRow.biomarker_type_name) {
        const correspondingObject = relatedObjects.find(
          (obj) => obj.name === newRow.biomarker_typer_name
        );
        newRow.biomarker_type_id = correspondingObject.id;
      }

      validateRequiredAttributes(requiredAttributes, attributeNames, newRow);
      return newRow;
    } catch (error) {
      const errorMessage = createErrorMessage(error, table);
      throw errorMessage;
    }
  }

  async function saveRow(id, row, oldRow, oldRows) {
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
      const errorMessage = createErrorMessage(error, row.name);
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
        <OneToManyDataGrid
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
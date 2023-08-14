/*
This file is
to customize the ui of the grid and
to integrate with a communication with backend.
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import FullEditDataGrid from '../../components/datagrid/FullFeaturedCrudGrid';
import officeController from './OfficeController';

export default function OfficeManageGrid() {
  const [rows, setRawRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  useEffect(() => {
    setLoading(true);
    officeController
      .getAll()
      .then((res) => {
        setRows(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSaveRow = (id, updatedRow, oldRow, oldRows) => {
    console.log(updatedRow);

    officeController
      .saveRow(updatedRow)
      .then((res) => {
        const dbRow = res.data;
        setRows(
          oldRows.map((r) => (r.id === updatedRow.id ? { ...dbRow } : r))
        );
      })
      .catch((err) => {
        setRows(oldRows);
      });
  };

  const onDeleteRow = (id, oldRow, oldRows) => {
    officeController
      .deleteRow(id)
      .then((res) => {
        const dbRowId = res.data.id;
        setRows(oldRows.filter((r) => r.id !== dbRowId));
      })
      .catch((err) => {
        setRows(oldRows);
      });
  };

  const createRowData = (rows) => {
    console.log(rows);

    const newId = Math.max(...rows.map((r) => (r.id ? r.id : 0) * 1)) + 1;
    const newNo = Math.max(...rows.map((r) => (r.no ? r.no : 0) * 1)) + 1;
    return { id: newId, no: newNo };
  };

  return (
    <FullEditDataGrid
      title='Offices'
      subtitle='Manage Offices'
      columns={columns}
      rows={rows}
      onSaveRow={onSaveRow}
      onDeleteRow={onDeleteRow}
      createRowData={createRowData}
      loading={loading}
    />
  );
}

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
    field: 'virtual',
    headerName: 'Telehealth',
    editable: true,
    type: 'boolean',
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
    field: 'city',
    headerName: 'City',
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
    type: 'singleSelect',
    valueOptions: ['Active', 'Inactive'],
    flex: 1,
  },
];

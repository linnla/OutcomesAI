import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import EditableDataGrid from '../../components/datagrid/editable';
import ReadOnlyDataGrid from '../../components/datagrid/readonly';
import { validateRow, saveRow, deleteRow } from './PractitionerController';
import UserContext from '../../contexts/UserContext';
import PractitionerContext from '../../contexts/PractitionerContext';

export default function PractitionerManageGrid() {
  const { role, practiceId } = useContext(UserContext);
  const [rows, setRawRows] = useState([]);

  const setRows = (rows) => {
    return setRawRows([...rows.map((r, i) => ({ ...r, no: i + 1 }))]);
  };

  const { practitioners, fetchAll } = useContext(PractitionerContext);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setRows(practitioners);
  }, [practitioners]);

  const onValidateRow = (newRow, oldRow, isNew) => {
    return new Promise((resolve, reject) => {
      validateRow(newRow, oldRow, isNew)
        .then((updatedRow) => {
          resolve(updatedRow); // Resolve with the updatedRow
        })
        .catch((error) => {
          console.error('onValidateRow error:', error);
          reject(error); // Reject with the validateRow error
        });
    });
  };

  const onSaveRow = (id, updatedRow, oldRow, oldRows, isNew) => {
    return new Promise((resolve, reject) => {
      let newRow = {};
      if (isNew) {
        newRow = { ...updatedRow, practice_id: practiceId };
        delete newRow.id;
      } else {
        newRow = { ...updatedRow };
      }

      saveRow(newRow, oldRow, isNew)
        .then((res) => {
          const dbRow = res;
          setRows(
            oldRows.map((r) => (r.id === updatedRow.id ? { ...dbRow } : r))
          );

          fetchAll();
          resolve(dbRow);
        })
        .catch((error) => {
          console.error('onSaveRow error', error);
          setRows(oldRows);
          reject(error); // Reject with saveRow error
        });
    });
  };

  const onDeleteRow = (id, oldRow, oldRows) => {
    return new Promise((resolve, reject) => {
      deleteRow(id, oldRows)
        .then((res) => {
          const dbRowId = res.data.id;
          setRows(oldRows.filter((r) => r.id !== dbRowId));
          fetchAll();
          resolve(); // Resolve on successful deletion
        })
        .catch((error) => {
          console.error('onDeleteRow error', error);
          setRows(oldRows);
          reject(error); // Reject on error
        });
    });
  };

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
          onValidateRow={onValidateRow}
          onSaveRow={onSaveRow}
          onDeleteRow={onDeleteRow}
          createRowData={createRowData}
          //loading={loading}
        />
      </div>
    );
  }
}

// Customize this data
const title = 'Practitioners';
const subtitle = 'Manage Practitioners';

const createRowData = (rows) => {
  // IS THIS REDUNDANT, ITS ALSO IN DefaultToolBar
  const newId = Math.floor(100000 + Math.random() * 900000);
  return {
    id: newId,
    last_name: '',
    first_name: '',
    suffix: '',
    prefix: '',
    email: '',
  };
};

const columns = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  {
    field: 'full_name',
    headerName: 'Name',
    editable: false,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'prefix',
    headerName: 'Prefix',
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Dr.', ''],
    defaultValueGetter: () => '',
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'first_name',
    headerName: 'First',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'last_name',
    headerName: 'Last',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'suffix',
    headerName: 'Suffix',
    editable: true,
    type: 'singleSelect',
    valueOptions: [
      'MD',
      'DO',
      'PMHNP',
      'AGNP',
      'ANP',
      'FNP',
      'GNP',
      'LMFT',
      'MFT',
      'NP',
      'PA',
      'PhD',
      'WHNP',
      '',
    ],
    defaultValueGetter: () => '',
    flex: 1,
    cellClassName: 'name-column--cell',
  },
  {
    field: 'email',
    headerName: 'Email',
    editable: true,
    flex: 1,
    cellClassName: 'name-column--cell',
  },
];

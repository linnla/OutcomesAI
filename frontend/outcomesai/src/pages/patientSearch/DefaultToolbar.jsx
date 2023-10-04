import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { SearchPatientDialog } from './SearchPatientDialog';

function DefaultToolbar(props) {
  //console.log('DefaultToolBar props:', props);
  const { refreshData } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]); // State to manage rows

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    const initialRows = props.rows || []; // Use props.rows if available, or an empty array
    setRows(initialRows);
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    console.log('Close Dialog');
    refreshData();
    setOpenDialog(false);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
      <Button
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        Search for DrChrono Patient
      </Button>
      <SearchPatientDialog
        open={openDialog}
        onClose={handleCloseDialog}
        reset={openDialog}
        rows={rows} // Pass the rows state as a prop
        setRows={setRows} // Pass the setRows function as a prop
      />
    </GridToolbarContainer>
  );
}

export default DefaultToolbar;

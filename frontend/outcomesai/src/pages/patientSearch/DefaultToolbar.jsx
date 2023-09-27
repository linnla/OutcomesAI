import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { SearchPatientDialog } from './SearchPatientDialog';

function DefaultToolbar(props) {
  const { columns } = props;
  const [openDialog, setOpenDialog] = useState(false);

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
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
        Add Patient
      </Button>
      <SearchPatientDialog open={openDialog} onClose={handleCloseDialog} />
    </GridToolbarContainer>
  );
}

export default DefaultToolbar;

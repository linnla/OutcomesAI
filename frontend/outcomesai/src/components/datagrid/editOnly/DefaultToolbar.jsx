import * as React from 'react';
import { useState } from 'react';
import { Switch } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import {
  GridRowModes,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from '@mui/x-data-grid-premium';
import GridExcelExportMenuItem from '../GridExcelExportMenuItem';
import Button from '@mui/material/Button';

function DefaultToolbar(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { rows, setRows, setRowModesModel, columns, createRowData } = props;

  const [showInactive, setShowInactive] = useState(true);

  // Function to handle switch toggle
  const handleSwitchChange = () => {
    // Your custom logic here for the Switch's onChange event
    // For example, you can perform filtering or any other actions.

    // For demonstration purposes, let's just update the switch state.
    setShowInactive(!showInactive);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer>
        <GridExcelExportMenuItem columns={columns} />
        <GridCsvExportMenuItem />
      </GridToolbarExportContainer>
      <div style={{ marginLeft: 'auto' }}>
        <Switch
          checked={showInactive}
          onChange={handleSwitchChange}
          color='secondary'
        />
        Show Inactive
      </div>
    </GridToolbarContainer>
  );
}

DefaultToolbar.defaultProps = {};

export default DefaultToolbar;

import * as React from 'react';
import {
  GridRowModes,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  // GridPrintExportMenuItem,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import GridExcelExportMenuItem from '../GridExcelExportMenuItem';

function DefaultToolbar(props) {
  const { columns } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer>
        <GridExcelExportMenuItem columns={columns} />
        <GridCsvExportMenuItem />
        {/*<GridPrintExportMenuItem />*/}
      </GridToolbarExportContainer>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export default DefaultToolbar;

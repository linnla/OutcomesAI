import * as React from 'react';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

function DefaultToolbar(props) {
  const { columns } = props;

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export default DefaultToolbar;

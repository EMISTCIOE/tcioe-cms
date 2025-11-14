import TableContainer from '@/components/app-table/TableContainer';
import { useGlobalGalleryTable } from '../../hooks/useGlobalGalleryTable';
import { getColumnConfig, IGlobalGalleryTableRow } from './config';

const GlobalGalleryListing = () => {
  return (
    <TableContainer<IGlobalGalleryTableRow>
      title="Global Gallery"
      useTableHook={useGlobalGalleryTable}
      getColumnConfig={getColumnConfig}
      allowEditing={false}
      allowDeleting={false}
    />
  );
};

export default GlobalGalleryListing;

import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { globalGalleryPermissions } from '../../constants/permissions';
import { useGlobalGalleryCollectionsTable } from '../../hooks/useGlobalGalleryCollectionsTable';
import { getColumnConfig, IGlobalGalleryCollectionTableRow } from './config';

const GlobalGalleryCreateForm = lazy(() => import('../create-form'));

const GlobalGalleryListing = () => {
  const tableHooks = useGlobalGalleryCollectionsTable();
  const canCreate = useHasParticularPermissions(globalGalleryPermissions.add);
  const canEdit = useHasParticularPermissions(globalGalleryPermissions.edit);
  const canDelete = useHasParticularPermissions(globalGalleryPermissions.delete);

  return (
    <TableContainer<IGlobalGalleryCollectionTableRow>
      title="Global Gallery Collections"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <GlobalGalleryCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default GlobalGalleryListing;

import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusSectionsPermissions } from '../../constants/persmissions';
import { useCampusSectionsTable } from '../../hooks/useCampusSectionsTable';
import { ITableData, getColumnConfig } from './config';

const CampusSectionsCreateForm = lazy(() => import('../create-form'));

const CampusSectionsListingSection = () => {
  const tableHooks = useCampusSectionsTable();

  const canCreate = useHasParticularPermissions(campusSectionsPermissions.add);
  const canEdit = useHasParticularPermissions(campusSectionsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusSectionsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Sections"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusSectionsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusSectionsListingSection;

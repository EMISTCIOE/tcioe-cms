import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusUnionsPermissions } from '../../constants/persmissions';
import { useCampusUnionsTable } from '../../hooks/useCampusUnionsTable';
import { ITableData, getColumnConfig } from './config';

const CampusUnionsCreateForm = lazy(() => import('../create-form'));

const CampusUnionsListingSection = () => {
  const tableHooks = useCampusUnionsTable();

  const canCreate = useHasParticularPermissions(campusUnionsPermissions.add);
  const canEdit = useHasParticularPermissions(campusUnionsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusUnionsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Unions"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusUnionsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusUnionsListingSection;

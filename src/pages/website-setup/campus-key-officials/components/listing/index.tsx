import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusKeyOfficialsPermissions } from '../../constants/persmissions';
import { useCampusKeyOfficialsTable } from '../../hooks/useCampusKeyOfficialsTable';
import { ITableData, getColumnConfig } from './config';

const CampusKeyOfficialsCreateForm = lazy(() => import('../create-form'));

const CampusKeyOfficialsListingSection = () => {
  const tableHooks = useCampusKeyOfficialsTable();

  const canCreate = useHasParticularPermissions(campusKeyOfficialsPermissions.add);
  const canEdit = useHasParticularPermissions(campusKeyOfficialsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusKeyOfficialsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Key Officials"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusKeyOfficialsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusKeyOfficialsListingSection;

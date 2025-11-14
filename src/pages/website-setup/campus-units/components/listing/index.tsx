import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusUnitsPermissions } from '../../constants/persmissions';
import { useCampusUnitsTable } from '../../hooks/useCampusUnitsTable';
import { ITableData, getColumnConfig } from './config';

const CampusUnitsCreateForm = lazy(() => import('../create-form'));

const CampusUnitsListingSection = () => {
  const tableHooks = useCampusUnitsTable();

  const canCreate = useHasParticularPermissions(campusUnitsPermissions.add);
  const canEdit = useHasParticularPermissions(campusUnitsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusUnitsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Units"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusUnitsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusUnitsListingSection;

import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusEventsPermissions } from '../../constants/persmissions';
import { useCampusEventsTable } from '../../hooks/useCampusEventsTable';
import { ITableData, getColumnConfig } from './config';

const CampusEventsCreateForm = lazy(() => import('../create-form'));

const CampusEventsListingSection = () => {
  const tableHooks = useCampusEventsTable();

  const canCreate = useHasParticularPermissions(campusEventsPermissions.add);
  const canEdit = useHasParticularPermissions(campusEventsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusEventsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Events"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusEventsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusEventsListingSection;

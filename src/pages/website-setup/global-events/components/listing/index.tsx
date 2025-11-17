import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { globalEventsPermissions } from '../../constants/permissions';
import { useGlobalEventsTable } from '../../hooks/useGlobalEventsTable';
import { getColumnConfig as getGlobalEventsColumnConfig, ITableData } from './config';
import useGlobalEventsApprovalChange from '../../hooks/useGlobalEventsApprovalChange';

const GlobalEventsCreateForm = lazy(() => import('../create-form'));

const GlobalEventsListing = () => {
  const tableHooks = useGlobalEventsTable();
  const canCreate = useHasParticularPermissions(globalEventsPermissions.add);
  const canEdit = useHasParticularPermissions(globalEventsPermissions.edit);
  const canDelete = useHasParticularPermissions(globalEventsPermissions.delete);
  const { onApprovalChange } = useGlobalEventsApprovalChange();

  return (
    <TableContainer<ITableData>
      title="Global Events"
      useTableHook={tableHooks}
      getColumnConfig={(theme) => getGlobalEventsColumnConfig(theme, canEdit, onApprovalChange)}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <GlobalEventsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default GlobalEventsListing;

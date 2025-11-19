import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions, useHasGlobalEventPermissions, useCanChangeApprovalStatus } from '@/utils/permissions/helpers';
import { globalEventsPermissions } from '../../constants/permissions';
import { useGlobalEventsTable } from '../../hooks/useGlobalEventsTable';
import { getColumnConfig as getGlobalEventsColumnConfig, ITableData } from './config';
import useGlobalEventsApprovalChange from '../../hooks/useGlobalEventsApprovalChange';

const GlobalEventsCreateForm = lazy(() => import('../create-form'));

const GlobalEventsListing = () => {
  const tableHooks = useGlobalEventsTable();
  const canCreate = useHasGlobalEventPermissions(globalEventsPermissions.add);
  const canEdit = useHasGlobalEventPermissions(globalEventsPermissions.edit);
  const canDelete = useHasParticularPermissions(globalEventsPermissions.delete);
  const canChangeApprovalStatus = useCanChangeApprovalStatus();
  const { onApprovalChange } = useGlobalEventsApprovalChange();

  return (
    <TableContainer<ITableData>
      title="Global Events"
      useTableHook={tableHooks}
      getColumnConfig={(theme) => getGlobalEventsColumnConfig(theme, canEdit, canChangeApprovalStatus, onApprovalChange)}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <GlobalEventsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default GlobalEventsListing;

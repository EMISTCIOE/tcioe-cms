import { useTheme } from '@mui/material';

// REACT IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';

// LOCAL IMPORTS
import { noticePermissions, noticeStatusPermission } from '../../constants/permissions';
import { useCustomActions } from '../../hooks/useCustomActions';
import { useNoticeStatusChange } from '../../hooks/useNoticeStatusChange';
import { useNoticeApprovalChange } from '../../hooks/useNoticeApprovalChange';
import { useNoticeTable } from '../../hooks/useNoticeTable';
import { ITableData, getColumnConfig } from './config';

// LAZY LOADED COMPONENTS
const NoticeCreateForm = lazy(() => import('../create-form'));

const NoticeListingSection = () => {
  const theme = useTheme();
  const customActions = useCustomActions();
  const { tableDataHook, isOptionsLoaded, noticeCategoriesOptions, noticeDepartmentsOptions } = useNoticeTable();
  const canCreate = useHasParticularPermissions(noticePermissions.add);
  const canEdit = useHasParticularPermissions(noticePermissions.edit);
  const canDelete = useHasParticularPermissions(noticePermissions.delete);
  const canUpdateStatus = useHasParticularPermissions(noticeStatusPermission.edit);
  const { onStatusChange } = useNoticeStatusChange();
  const { onApprovalChange } = useNoticeApprovalChange();

  if (!isOptionsLoaded) {
    return null;
  }

  return (
    <TableContainer<ITableData>
      title="Notices"
      useTableHook={tableDataHook}
      getColumnConfig={() =>
        getColumnConfig(
          theme,
          noticeCategoriesOptions.map((option) => ({ label: option.label, value: option.value })),
          noticeDepartmentsOptions.map((option) => ({ label: option.label, value: option.value })),
          canUpdateStatus,
          onStatusChange,
          onApprovalChange,
          customActions
        )
      }
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <NoticeCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
      showFilter
      showSearch
      showExport
      showDensitySelector
      enableRowSelection
    />
  );
};

export default NoticeListingSection;

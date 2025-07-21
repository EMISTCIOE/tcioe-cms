// REACT IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import TableContainer from '@/components/app-table/TableContainer';

// LOCAL IMPORTS
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { noticePermissions } from '../../constants/permissions';
import { useNoticeTable } from '../../hooks/useNoticeTable';
import { ITableData, getColumnConfig } from './config';
import { useTheme } from '@mui/material';

// LAZY LOADED COMPONENTS
const NoticeCreateForm = lazy(() => import('../create-form'));

const NoticeListingSection = () => {
  const theme = useTheme();
  const { tableDataHook, isOptionsLoaded, noticeCategoriesOptions, noticeDepartmentsOptions } = useNoticeTable();
  const canCreate = useHasParticularPermissions(noticePermissions.add);
  const canEdit = useHasParticularPermissions(noticePermissions.edit);
  const canDelete = useHasParticularPermissions(noticePermissions.delete);

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
          noticeDepartmentsOptions.map((option) => ({ label: option.label, value: option.value }))
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

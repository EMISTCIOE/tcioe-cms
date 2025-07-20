// REACT IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import TableContainer from '@/components/app-table/TableContainer';

// LOCAL IMPORTS
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { noticePermissions } from '../../constants/permissions';
import { useNoticeTable } from '../../hooks/useNoticeTable';
import { ITableData, getColumnConfig } from './config';

// LAZY LOADED COMPONENTS
const NoticeCreateForm = lazy(() => import('../create-form'));

const NoticeListingSection = () => {
  const tableHooks = useNoticeTable();
  const canCreate = useHasParticularPermissions(noticePermissions.add);
  const canEdit = useHasParticularPermissions(noticePermissions.edit);
  const canDelete = useHasParticularPermissions(noticePermissions.delete);
  
  return (
    <TableContainer<ITableData>
      title="Notices"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <NoticeCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={false}
      showFilter
      showSearch
      showExport
      showDensitySelector
      enableRowSelection
    />
  );
};

export default NoticeListingSection;

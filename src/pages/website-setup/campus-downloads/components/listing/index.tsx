import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusDownloadsPermissions } from '../../constants/persmissions';
import { useCampusDownloadsTable } from '../../hooks/useCampusDownloadsTable';
import { ITableData, getColumnConfig } from './config';

const CampusDownloadsCreateForm = lazy(() => import('../create-form'));

const CampusDownloadsListingSection = () => {
  const tableHooks = useCampusDownloadsTable();

  const canCreate = useHasParticularPermissions(campusDownloadsPermissions.add);
  const canEdit = useHasParticularPermissions(campusDownloadsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusDownloadsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Downloads"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusDownloadsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusDownloadsListingSection;

import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { academicDownloadsPermissions } from '../../constants/persmissions';
import { useAcademicDownloadsTable } from '../../hooks/useAcademicDownloadsTable';
import { ITableData, getColumnConfig } from './config';

const AcademicDownloadsCreateForm = lazy(() => import('../create-form'));

const AcademicDownloadsListingSection = () => {
  const tableHooks = useAcademicDownloadsTable();
   const { roleType } = useAppSelector(authState);

  const canCreate = useHasParticularPermissions(academicDownloadsPermissions.add);
  const canEdit = useHasParticularPermissions(academicDownloadsPermissions.edit);
  const canDelete = useHasParticularPermissions(academicDownloadsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Academic Downloads"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={
        canCreate ? (onClose) => <AcademicDownloadsCreateForm onClose={onClose} /> : undefined
      }
      allowEditing={canEdit}
      allowDeleting={roleType === 'DEPARTMENT-ADMIN' ? false : canDelete}
    />
  );
};

export default AcademicDownloadsListingSection;

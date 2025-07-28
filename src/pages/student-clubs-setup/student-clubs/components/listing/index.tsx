import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { studentClubsPermissions } from '../../constants/persmissions';
import { useStudentClubsTable } from '../../hooks/useStudentClubsTable';
import { ITableData, getColumnConfig } from './config';

const StudentClubsCreateForm = lazy(() => import('../create-form'));

const StudentClubsListingSection = () => {
  const tableHooks = useStudentClubsTable();

  const canCreate = useHasParticularPermissions(studentClubsPermissions.add);
  const canEdit = useHasParticularPermissions(studentClubsPermissions.edit);
  const canDelete = useHasParticularPermissions(studentClubsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Student Clubs"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <StudentClubsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default StudentClubsListingSection;

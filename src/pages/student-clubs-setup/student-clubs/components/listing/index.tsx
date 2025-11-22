import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { studentClubsPermissions } from '../../constants/persmissions';
import { useStudentClubsTable } from '../../hooks/useStudentClubsTable';
import { ITableData, getColumnConfig } from './config';

const StudentClubsCreateForm = lazy(() => import('../create-form'));

const StudentClubsListingSection = () => {
  const tableHooks = useStudentClubsTable();
  const { roleType } = useAppSelector(authState);
  const isClubUser = roleType === 'CLUB';

  const canCreate = isClubUser ? false : useHasParticularPermissions(studentClubsPermissions.add);
  const canEdit = isClubUser ? true : useHasParticularPermissions(studentClubsPermissions.edit);
  const canDelete = isClubUser ? false : useHasParticularPermissions(studentClubsPermissions.delete);
  const createForm = !isClubUser && canCreate ? (onClose: () => void) => <StudentClubsCreateForm onClose={onClose} /> : undefined;

  return (
    <TableContainer<ITableData>
      title="Student Clubs"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={createForm}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default StudentClubsListingSection;

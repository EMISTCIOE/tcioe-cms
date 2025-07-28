import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { studentClubEventsPermissions } from '../../constants/persmissions';
import { useStudentClubEventsTable } from '../../hooks/useStudentClubEventsTable';
import { ITableData, getColumnConfig } from './config';
import { useTheme } from '@mui/material';

const StudentClubEventsCreateForm = lazy(() => import('../create-form'));

const StudentClubEventsListingSection = () => {
  const theme = useTheme();
  const { tableDataHook, isOptionsLoaded, studentClubsOptions } = useStudentClubEventsTable();

  const canCreate = useHasParticularPermissions(studentClubEventsPermissions.add);
  const canEdit = useHasParticularPermissions(studentClubEventsPermissions.edit);
  const canDelete = useHasParticularPermissions(studentClubEventsPermissions.delete);

  if (!isOptionsLoaded) {
    return null;
  }

  return (
    <TableContainer<ITableData>
      title="Student Club Events"
      useTableHook={tableDataHook}
      getColumnConfig={() =>
        getColumnConfig(
          theme,
          studentClubsOptions.map((option) => ({ label: option.label, value: option.value }))
        )
      }
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <StudentClubEventsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default StudentClubEventsListingSection;

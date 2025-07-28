import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { academicCalendarsPermissions } from '../../constants/persmissions';
import { useAcademicCalendarsTable } from '../../hooks/useAcademicCalendarsTable';
import { ITableData, getColumnConfig } from './config';

const AcademicCalendarsCreateForm = lazy(() => import('../create-form'));

const AcademicCalendarsListingSection = () => {
  const tableHooks = useAcademicCalendarsTable();

  const canCreate = useHasParticularPermissions(academicCalendarsPermissions.add);
  const canEdit = useHasParticularPermissions(academicCalendarsPermissions.edit);
  const canDelete = useHasParticularPermissions(academicCalendarsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Academic Calendars"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <AcademicCalendarsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default AcademicCalendarsListingSection;

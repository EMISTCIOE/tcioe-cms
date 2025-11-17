import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { departmentsPermissions } from '../../constants/permissions';
import { useDepartmentsTable } from '../../hooks/useDepartmentsTable';
import { ITableData, getColumnConfig } from './config';

const DepartmentsCreateForm = lazy(() => import('../create-form/index'));

const DepartmentsListingSection = () => {
  const tableHooks = useDepartmentsTable();

  const canCreate = useHasParticularPermissions(departmentsPermissions.add);
  const canEdit = useHasParticularPermissions(departmentsPermissions.edit);
  const canDelete = useHasParticularPermissions(departmentsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Departments"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <DepartmentsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default DepartmentsListingSection;

import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { departmentsPermissions } from '../../constants/permissions';
import { useDepartmentsTable } from '../../hooks/useDepartmentsTable';
import { ITableData, getColumnConfig } from './config';

const DepartmentsCreateForm = lazy(() => import('../create-form/index'));

const DepartmentsListingSection = () => {
  const tableHooks = useDepartmentsTable();
  const { roleType } = useAppSelector(authState);

  const canCreate = useHasParticularPermissions(departmentsPermissions.add);
  const canEdit = useHasParticularPermissions(departmentsPermissions.edit) || roleType === 'DEPARTMENT-ADMIN';
  const canDelete = useHasParticularPermissions(departmentsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Departments"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={
        roleType === 'DEPARTMENT-ADMIN' ? undefined : canCreate ? (onClose) => <DepartmentsCreateForm onClose={onClose} /> : undefined
      }
      allowEditing={canEdit}
      allowDeleting={roleType === 'DEPARTMENT-ADMIN' ? false : canDelete}
    />
  );
};

export default DepartmentsListingSection;

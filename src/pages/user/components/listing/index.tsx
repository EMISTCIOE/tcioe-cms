import { lazy, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { userPermissions } from '../../constants/permissions';
import { useUserTable } from '../../hooks/useUserTable';
import { TableData, getColumnConfig } from './config';

const UserCreateForm = lazy(() => import('../create-form'));

const ROLE_CONFIG = {
  'EMIS-STAFF': {
    title: 'EMIS Staff',
    createButtonTitle: 'Add EMIS Staff'
  },
  ADMIN: {
    title: 'Admin',
    createButtonTitle: 'Add Admin'
  },
  'DEPARTMENT-ADMIN': {
    title: 'Department Admin',
    createButtonTitle: 'Add Department Admin'
  },
  CLUB: {
    title: 'Club Users',
    createButtonTitle: 'Add Club User'
  },
  UNION: {
    title: 'Union Users',
    createButtonTitle: 'Add Union User'
  },
  'CAMPUS-UNIT': {
    title: 'Campus Unit Users',
    createButtonTitle: 'Add Campus Unit User'
  },
  'CAMPUS-SECTION': {
    title: 'Campus Section Users',
    createButtonTitle: 'Add Campus Section User'
  }
} as const;

type RoleKey = keyof typeof ROLE_CONFIG;
const DEFAULT_ROLE: RoleKey = 'EMIS-STAFF';

const UserListingSection = () => {
  const location = useLocation();

  const roleParam = useMemo(
    () => new URLSearchParams(location.search).get('role')?.toUpperCase() as RoleKey | undefined,
    [location.search]
  );
  const role: RoleKey = roleParam && Object.prototype.hasOwnProperty.call(ROLE_CONFIG, roleParam) ? roleParam : DEFAULT_ROLE;

  const staticFilters = useMemo(() => ({ role }), [role]);
  const tableHooks = useUserTable({ filters: staticFilters });

  const canCreate = useHasParticularPermissions(userPermissions.add);
  const canEdit = useHasParticularPermissions(userPermissions.edit);
  const canDelete = useHasParticularPermissions(userPermissions.delete);

  const createForm = canCreate ? (onClose: () => void) => <UserCreateForm onClose={onClose} fixedRole={role} /> : undefined;
  const createButtonTitle = ROLE_CONFIG[role].createButtonTitle;
  const title = `${ROLE_CONFIG[role].title}`;

  return (
    <TableContainer<TableData>
      key={role}
      title={`${title} Users`}
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      tableProps={{
        sx: {
          '& .MuiDataGrid-root': {
            minHeight: { xs: 480, sm: 'auto' }
          }
        }
      }}
      createButtonTitle={createForm ? createButtonTitle : undefined}
      createNewForm={createForm}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default UserListingSection;

import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export interface UserRole {
  id: string;
  name: string;
  codename: string;
  isActive?: boolean;
}

export interface UseRoleList {
  count: number;
  results: UserRole[];
}

export interface IUser {
  id: string;
  username: string;
  firstName: string;
  middleName: string;
  email: string;
  phoneNo: string;
  photo: string;
  lastName: string;
  isActive: boolean;
  dateJoined: string;
  updatedAt: string;
  role: string;
  roleDisplay: string;
  designationTitle?: string | null;
  departmentName?: string | null;
  clubName?: string | null;
  unionName?: string | null;
  campusUnitName?: string | null;
  campusSectionName?: string | null;
}

export interface UserList {
  count: number;
  results: IUser[];
}

export type UserItem = IUser;

export interface UserCreatePayload {
  firstName: string;
  middleName: string;
  lastName: string;
  username?: string;
  email: string;
  password?: string;
  roles: string[];
  phoneNo?: string;
  isActive?: boolean;
  photo?: File | null | undefined;
  // New optional fields to support backend `role` and relations
  role?: string;
  designation?: string;
  department?: string;
  club?: string;
  union?: string;
  campusUnit?: string;
  campusSection?: string;
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  roles?: string[];
  phoneNo?: string;
  isActive?: boolean;
  photo?: File | null | undefined;
  campusUnit?: string;
  campusSection?: string;
}

export interface UserDetails extends IUser {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin: string;
  createdByUsername: string;
  createdBy: string;
  roles: { id: string; name: string }[];
  permissions: string[];
}

export interface UserSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

export interface UserListQueryParams {
  search: string;
  paginationModel?: GridPaginationModel;
  sortModel?: GridSortModel;
  filterModel?: GridFilterModel;
  filters?: Record<string, string | number | boolean | undefined>;
}

export interface UserRolesListQueryParams {
  search: string;
  paginationModel?: GridPaginationModel;
  sortModel?: GridSortModel;
}

import { IRequiredPermission } from '@/globals';

// Department downloads permissions (backend codenames)
export const academicDownloadsPermissions: IRequiredPermission = {
  view: 'view_department_download',
  edit: 'edit_department_download',
  add: 'add_department_download',
  delete: 'delete_department_download'
};

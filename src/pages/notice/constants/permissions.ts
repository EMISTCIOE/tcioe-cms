import { IRequiredPermission } from '@/globals';

export const noticePermissions: IRequiredPermission = {
  view: 'view_notice',
  edit: 'edit_notice',
  add: 'add_notice',
  delete: 'delete_notice'
};

export const noticeStatusPermission: IRequiredPermission = {
  view: 'view_status',
  edit: 'edit_status',
  add: 'add_status',
  delete: 'delete_status'
};

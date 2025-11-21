import { IRequiredPermission } from '@/globals';

export const noticePermissions: IRequiredPermission = {
  view: 'view_notice',
  edit: 'change_notice', // Changed from 'edit_notice' to 'change_notice' to match backend
  add: 'add_notice',
  delete: 'delete_notice'
};

export const noticeStatusPermission: IRequiredPermission = {
  view: 'view_notice_status',
  edit: 'edit_notice_status', // Match backend permission name
  add: 'add_notice_status',
  delete: 'delete_notice_status'
};

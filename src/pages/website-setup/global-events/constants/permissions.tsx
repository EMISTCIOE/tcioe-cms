import { IRequiredPermission } from '@/globals';

export const globalEventsPermissions: IRequiredPermission = {
  view: ['view_globalevent'],
  edit: 'change_globalevent',
  add: 'add_globalevent',
  delete: 'delete_globalevent'
};

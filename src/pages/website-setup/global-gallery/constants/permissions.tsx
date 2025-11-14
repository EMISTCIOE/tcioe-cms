import { IRequiredPermission } from '@/globals';

export const globalGalleryPermissions: IRequiredPermission = {
  view: ['view_campusevent', 'view_studentclubevent', 'view_departmentevent'],
  edit: 'view_campusevent',
  add: 'view_campusevent',
  delete: 'view_campusevent'
};
